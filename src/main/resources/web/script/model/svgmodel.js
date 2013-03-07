/**
 * A topicmap model that is attached to the database. There are methods for:
 *  - loading a topicmap from DB
 *  - manipulating the topicmap by e.g. adding/removing topics and associations
 *
 *  SVG specific model derived from the default model
 */
function Svgmap(topicmap_id, config) {

    var LOG_TOPICMAPS = true
    var self = this

    var info                // The underlying Topicmap topic (a Topic object)
    var topics = {}         // topics of this topicmap (key: topic ID, value: TopicmapTopic object)
    var assocs = {}         // associations of this topicmap (key: association ID, value: TopicmapAssociation object)
    var trans_x, trans_y      // topicmap translation (in pixel)
    this.selected_object_id = -1    // ID of the selected topic or association, or -1 for no selection
    this.is_topic_selected          // true indicates topic selection, false indicates association selection
                                    // only evaluated if there is a selection (selected_object_id != -1)
    this.background_image   // JavaScript Image object

    load()



    // ------------------------------------------------------------------------------------------------------ Public API

    this.get_id = function() {
        return topicmap_id
    }

    this.get_renderer_uri = function() {
        return info.get("dm4.topicmaps.topicmap_renderer_uri")
    }

    this.get_topic = function(id) {
        return topics[id]
    }

    this.iterate_topics = function(visitor_func) {
        iterate_topics(visitor_func)
    }

    this.iterate_associations = function(visitor_func) {
        iterate_associations(visitor_func)
    }

    this.add_topic = function(id, type_uri, label, x, y) {
        var topic = topics[id]
        if (!topic) {
            if (LOG_TOPICMAPS) dm4c.log("Adding topic " + id + " (\"" + label + "\") to topicmap " + topicmap_id)
            // update memory
            topics[id] = new SvgTopic(id, type_uri, label, x, y, true)     // visibility=true
            // update DB
            if (is_writable()) {
                dm4c.restc.add_topic_to_topicmap(topicmap_id, id, x, y)
            }
        } else if (!topic.visibility) {
            if (LOG_TOPICMAPS)
                dm4c.log("Showing topic " + id + " (\"" + topic.label + "\") on topicmap " + topicmap_id)
            // update memory
            topic.show()
            // update DB
            if (is_writable()) {
                dm4c.restc.set_topic_visibility(topicmap_id, id, true)
            }
        } else {
            if (LOG_TOPICMAPS)
                dm4c.log("Topic " + id + " (\"" + label + "\") already visible in topicmap " + topicmap_id)
        }
    }

    this.add_association = function(id, type_uri, topic_id_1, topic_id_2) {
        if (!assocs[id]) {
            if (LOG_TOPICMAPS) dm4c.log("Adding association " + id + " to topicmap " + topicmap_id)
            // update memory
            assocs[id] = new SvgAssociation(id, type_uri, topic_id_1, topic_id_2)
            // update DB
            if (is_writable()) {
                dm4c.restc.add_association_to_topicmap(topicmap_id, id)
            }
        } else {
            if (LOG_TOPICMAPS) dm4c.log("Association " + id + " already in topicmap " + topicmap_id)
        }
    }

    this.move_topic = function(id, x, y) {
        var topic = topics[id]

        if (LOG_TOPICMAPS) dm4c.log("Moving topic " + id + " (\"" + topic.label + "\") on topicmap " + topicmap_id
            + " to x=" + x + ", y=" + y)
        // update memory
        // topic.move_to(x, y)
        // update DB
        var cas = this.get_associations(id)
        for (var i = 0, ca; ca = cas[i]; i++) {
            if(ca.topic_id_1 == topic.id){
                ca.x1 = x
                ca.y1 = y
            } else {
                ca.x2 = x
                ca.y2 = y

            }
            this.update_association(ca)
        }
        if (is_writable()) {
            dm4c.restc.move_topic(topicmap_id, id, x, y)
        }
    }

    this.hide_topic = function(id) {
        var topic = topics[id]
        if (LOG_TOPICMAPS) dm4c.log("Hiding topic " + id + " (\"" + topic.label + "\") from topicmap " + topicmap_id)
        // update memory
        topic.hide()
        // update DB
        if (is_writable()) {
            dm4c.restc.set_topic_visibility(topicmap_id, id, false)
        }
    }

    this.hide_association = function(id) {
        var assoc = assocs[id]
        if (LOG_TOPICMAPS) dm4c.log("Hiding association " + id + " from topicmap " + topicmap_id)
        // update memory
        assoc.hide()
        // update DB
        if (is_writable()) {
            dm4c.restc.remove_association_from_topicmap(topicmap_id, id)
        }
    }

    /**
     * @param   topic   a Topic object
     */
    this.update_topic = function(topic) {
        var t = topics[topic.id]
        if (t) {
            if (LOG_TOPICMAPS) dm4c.log("..... Updating topic " + t.id + " (\"" + t.label + "\") on topicmap " +
                topicmap_id)
            t.update(topic)
        }
    }

    /**
     * @param   assoc   an Association object
     */
    this.update_association = function(assoc) {
        var a = assocs[assoc.id]

        if (a) {
            if (LOG_TOPICMAPS) dm4c.log("..... Updating association " + a.id + " on topicmap " + topicmap_id)
            assoc.parent = a.parent
            a.remove()
            assocs[assoc.id] = assoc
            assoc.render()

        }
    }

    this.delete_topic = function(id) {
        var topic = topics[id]
        if (topic) {
            if (LOG_TOPICMAPS) dm4c.log("..... Deleting topic " + id + " (\"" + topic.label + "\") from topicmap " +
                topicmap_id)
            topic.remove()
        }
    }

    this.delete_association = function(id) {
        var assoc = assocs[id]
        if (assoc) {
            if (LOG_TOPICMAPS) dm4c.log("..... Deleting association " + id + " from topicmap " + topicmap_id)
            assoc.remove()
        }
    }

    this.set_topic_selection = function(topic) {
        this.selected_object_id = topic.id
        this.is_topic_selected = true
    }

    this.set_association_selection = function(assoc) {
        this.selected_object_id = assoc.id
        this.is_topic_selected = false
    }

    this.reset_selection = function() {
        this.selected_object_id = -1
    }

    this.prepare_topic_for_display = function(topic) {
        // restores topic position if topic is already contained in this topicmap but hidden
        var t = this.get_topic(topic.id)
        if (t && !t.visibility) {
            topic.x = t.x
            topic.y = t.y
        }
    }

    this.move_cluster = function(cluster) {
        // update memory
        cluster.iterate_topics(function(ct) {
            topics[ct.id].move_to(ct.x, ct.y)
        })
        // update DB
        if (is_writable()) {
            dm4c.restc.move_cluster(topicmap_id, cluster_coords())
        }

        function cluster_coords() {
            var coord = []
            cluster.iterate_topics(function(ct) {
                coord.push({
                    topic_id: ct.id,
                    x: ct.x,
                    y: ct.y
                })
            })
            return coord
        }
    }



    this.set_translation = function(tx, ty) {
        // update memory
        trans_x = trans_x+tx
        trans_y = trans_y+ty
        this.iterate_topics(function(topic){
           topic.move_to(topic.glob_x+tx, topic.glob_y+ty)
        })
        this.iterate_associations(function(assoc){
            assoc.move_to(assoc.glob_x+tx, assoc.glob_y+ty)
        })

        // update DB

        if (is_writable()) {
            dm4c.restc.set_topicmap_translation(topicmap_id, trans_x, trans_y)
        }
    }

    this.draw_background = function(ctx) {
        if (this.background_image) {
            ctx.drawImage(this.background_image, 0, 0)
        }
    }



    // ----------------------------------------------------------------------------------------------- Private Functions

    function load() {

        if (LOG_TOPICMAPS) dm4c.log("Loading topicmap " + topicmap_id)

        var topicmap = dm4c.restc.get_topicmap(topicmap_id)
        info = new Topic(topicmap.info)
                init_translation()
        if (LOG_TOPICMAPS) dm4c.log("..... " + topicmap.topics.length + " topics")
        init_topics()

        if (LOG_TOPICMAPS) dm4c.log("..... " + topicmap.assocs.length + " associations")
        init_associations()

        init_background_image()

        function init_topics() {
            for (var i = 0, topic; topic = topicmap.topics[i]; i++) {
                var x = topic.visualization["dm4.topicmaps.x"].value
                var y = topic.visualization["dm4.topicmaps.y"].value
                var visibility = topic.visualization["dm4.topicmaps.visibility"].value
                if (LOG_TOPICMAPS) dm4c.log(".......... ID " + topic.id + ": type_uri=\"" + topic.type_uri +
                    "\", label=\"" + topic.value + "\", x=" + x + ", y=" + y + ", visibility=" + visibility)
                topics[topic.id] = new SvgTopic(topic.id, topic.type_uri, topic.value, x, y, visibility, trans_x, trans_y)
            }
        }

        function init_associations() {
            for (var i = 0, assoc; assoc = topicmap.assocs[i]; i++) {
                if (LOG_TOPICMAPS) dm4c.log(".......... ID " + assoc.id + ": type_uri=\"" + assoc.type_uri +
                    "\", topic_id_1=" + assoc.role_1.topic_id + ", topic_id_2=" + assoc.role_2.topic_id)
                assocs[assoc.id] = new SvgAssociation(assoc.id, assoc.type_uri,
                    assoc.role_1.topic_id, assoc.role_2.topic_id, topics[assoc.role_1.topic_id].x,
                    topics[assoc.role_1.topic_id].y,topics[assoc.role_2.topic_id].x,
                    topics[assoc.role_2.topic_id].y, trans_x, trans_y)
            }
        }

        // ---

        function init_translation() {
            var trans = info.get("dm4.topicmaps.state").get("dm4.topicmaps.translation")
            trans_x = trans.get("dm4.topicmaps.translation_x")
            trans_y = trans.get("dm4.topicmaps.translation_y")
            alert(trans_x)

        }

        function init_background_image() {
            var file = info.get("dm4.files.file")
            if (file) {
                var image_url = "/filerepo/" + file.get("dm4.files.path")
                self.background_image = dm4c.create_image(image_url)
            }
        }
    }


    // ---

    function iterate_topics(visitor_func) {
        for (var id in topics) {
            visitor_func(topics[id])
        }
    }

    function iterate_associations(visitor_func) {
        for (var id in assocs) {
            visitor_func(assocs[id])
        }

    }
    //--

    this.get_associations = function(topic_id) {
            var cas = []
            this.iterate_associations(function(ca) {
                if (ca.is_player_topic(topic_id)) {
                    cas.push(ca)
                }
            })
            return cas
        }
    // ---

    function is_writable() {
        return config.is_writable
    }



    // ------------------------------------------------------------------------------------------------- Private Classes


}
