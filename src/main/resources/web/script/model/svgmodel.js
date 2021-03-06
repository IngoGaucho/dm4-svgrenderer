/**
 * A topicmap model that is attached to the database. There are methods for:
 *  - ing a topicmap from DB
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

    this.add_topic = function(id, type_uri, value, x, y, parent) {
        var topic = topics[id]
        if (!topic) {
            if (LOG_TOPICMAPS) dm4c.log("Adding topic " + id + " (\"" + value + "\") to topicmap " + topicmap_id)
            // update memory
            topics[id] = new SvgTopic(id, type_uri, value, x, y, true, trans_x, trans_y)     // visibility=true
            var topic = topics[id]
            topic.parent = parent
            topic.render()
            // update DB
            if (is_writable()) {
                dm4c.restc.add_topic_to_topicmap(topicmap_id, id, x, y)
            }
        } else if (!topic.visibility) {
            if (LOG_TOPICMAPS)
                dm4c.log("Showing topic " + id + " (\"" + topic.value + "\") on topicmap " + topicmap_id)
            // update memory
            topic.show()
            // update DB
            if (is_writable()) {
                dm4c.restc.set_topic_visibility(topicmap_id, id, true)
            }
        } else {
            if (LOG_TOPICMAPS)
                dm4c.log("Topic " + id + " (\"" + value + "\") already visible in topicmap " + topicmap_id)
        }
    }
    //#TODO: giving the init parameters for topics x,y is evil, but we need a fix
    this.add_association = function(id, type_uri, topic_id_1, topic_id_2, parent) {
        if (!assocs[id]) {
            if (LOG_TOPICMAPS) dm4c.log("Adding association " + id + " to topicmap " + topicmap_id)
            // update memory
            //the following is evil
            var x1, y1, x2, y2
            if(topics[topic_id_1]){
                x1 = topics[topic_id_1].x
                y1 = topics[topic_id_1].y
            } else {
                x1 = 0
                y1 = 0
            }

            if(topics[topic_id_2]){

                x2 = topics[topic_id_2].x
                y2 = topics[topic_id_2].y
            } else {
                x2 = 0
                y2 = 0
            }

            assocs[id] = new SvgAssociation(id, type_uri, topic_id_1, topic_id_2, x1, y1,x2, y2, trans_x, trans_y)
            var na = assocs[id]
            na.parent = parent
            na.render()                // update DB

            if (is_writable()) {
                dm4c.restc.add_association_to_topicmap(topicmap_id, id)
            }
        } else {
            if (LOG_TOPICMAPS) dm4c.log("Association " + id + " already in topicmap " + topicmap_id)
        }
    }

    this.move_topic = function(id, x, y) {
        var topic = topics[id]

        if (LOG_TOPICMAPS) dm4c.log("Moving topic " + id + " (\"" + topic.value + "\") on topicmap " + topicmap_id
            + " to x=" + x + ", y=" + y)
        // update assocs.

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
        // update DB
        if (is_writable()) {
            dm4c.restc.move_topic(topicmap_id, id, x, y)
        }
    }

    this.hide_topic = function(id) {
        var topic = topics[id]
        var assoc = assocs[id]
        alert("hide")
        if (LOG_TOPICMAPS) dm4c.log("Hiding assoc/topic " + id +" from topicmap " + topicmap_id)
        // update memory
            topic.hide()
            var cas = this.get_associations(id)
            for (var i = 0, ca; ca = cas[i]; i++) {
               this.hide_association(ca.id)
            }
          if (is_writable()) {
                dm4c.restc.set_topic_visibility(topicmap_id, id, false)
            }


    }

    this.hide_association = function(id) {
        alert("gong")
        var assoc = assocs[id]
        if (LOG_TOPICMAPS) dm4c.log("Hiding association " + id + " from topicmap " + topicmap_id)
        // update memory
        assoc.hide()
        // update DB
        delete assocs[id]

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
            if (LOG_TOPICMAPS) dm4c.log("..... Updating topic " + t.id + " (\"" + t.value + "\") on topicmap " +
                topicmap_id)
        t.remove()
        t.value = topic.value
        topics[topic.id].value = topic.value
        //#TODO there is a more elegant way
        t.render()

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
            if(assoc.x1) assocs[assoc.id] = assoc
            else{
                assocs[assoc.id].type_uri = assoc.type_uri
                assoc = assocs[assoc.id]
            }
            assoc.render()

        }
    }

    this.delete_item = function(id) {
        var topic = topics[id]
        var assoc = assocs[id]

        if (LOG_TOPICMAPS) dm4c.log("Hiding assoc/topic " + id +" from topicmap " + topicmap_id)
        // update memory
        if (topic){
                dm4c.fire_event("post_delete_topic", topic)
        } else if (assoc){
                dm4c.fire_event("post_delete_association", assoc)
        }

    }
    this.delete_topic = function(id) {
        var topic = topics[id]

        if (topic) {
            if (LOG_TOPICMAPS) dm4c.log("..... Deleting topic " + id + " (\"" + topic.value + "\") from topicmap " +
                topicmap_id)
            topic.remove()
            delete topics[id]
            var cas = this.get_associations(id)
            for (var i = 0, ca; ca = cas[i]; i++) {
                this.delete_association(ca.id)
            }
        }
    }

    this.delete_association = function(id) {
        var assoc = assocs[id]
        if (assoc) {
            if (LOG_TOPICMAPS) dm4c.log("..... Deleting association " + id + " from topicmap " + topicmap_id)
            assoc.remove()
            delete assocs[id]
        }
    }

    this.set_topic_selection = function(topic) {
        this.selected_object_id = topic.id
        this.is_topic_selected = true
    }

    this.set_association_selection = function(assoc) {
        //this.selected_object_id = assoc.id
        //this.is_topic_selected = false
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

    this.move_cluster = function(dragdata) {
        // update memory
        cluster = new Cluster(dragdata.assoc)
        cluster.move_by(dragdata.dx,dragdata.dy)
         //   topics[ct.id].move_to(ct.x, ct.y)
        //})
        // update DB
        //if (is_writable()) {
          //  dm4c.restc.move_cluster(topicmap_id, cluster_coords())
        //}

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
                    "\", value=\"" + topic.value + "\", x=" + x + ", y=" + y + ", visibility=" + visibility)

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

        }

        function init_background_image() {
            var file = info.get("dm4.files.file")
            if (file) {
                var image_url = "/filerepo/" + file.get("dm4.files.path")
                self.background_image = dm4c.create_image(image_url)
            }
        }
    }

    this.is_topic_on_map = function(topic_ID){
       if(topics[topic_ID]){
            return true
        }else{
            return false
        }
    }

   this.is_assoc_on_map = function(assoc_ID){
        if (assocs[assoc_ID]) {
            return true
        } else {
            return false
        }
    }

    this.clear = function() {
                // Must reset canvas translation.
                // See TopicmapRenderer contract.
                // Nope ;)

                this.iterate_topics(function(topic) {
                topic.remove()
                })

                this.iterate_associations(function(assoc) {
                assoc.remove()
                })


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
   var ta
   this.render_tmp_assoc = function(start_id,x,y, parent){
        if(ta) ta.remove()
        ta = new SvgAssociation("tmp_assoc", null, null, null, topics[start_id].getRealCoords().rx, topics[start_id].getRealCoords().ry ,x, y, 0, 0)
        ta.parent = parent
        ta.render()
   }

   this.delete_tmp_assoc = function() {
        ta.remove()
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
    // ---

    function Cluster(ca) {

        var cts = []    // array of CanvasTopic

        add_to_cluster(topics[ca.get_topic_1()])

        this.move_by = function(dx, dy) {
            this.iterate_topics(function(ct) {
                ct.move_by(dx, dy)
            })
        }

        this.iterate_topics = function(visitor_func) {
            for (var i = 0, ct; ct = cts[i]; i++) {
                visitor_func(ct)
            }
        }

        function add_to_cluster(ct) {
            if (is_in_cluster(ct)) {
                return
            }
            //
            cts.push(ct)
            var cas = self.get_associations(ct.id)
            for (var i = 0, ca; ca = cas[i]; i++) {
                add_to_cluster(topics[ca.get_other_topic(ct.id)])
            }
        }

        function is_in_cluster(ct) {
            return js.includes(cts, function(cat) {
                return cat.id == ct.id
            })
        }
    }

}
