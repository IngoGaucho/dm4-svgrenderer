function SvgRenderer(){


   // ------------------------------------------------------------------------------------------------ Constructor Code

    js.extend(this, TopicmapRenderer)
    this.dom = $("<div>", {id: "canvas"})

      // === TopicmapRenderer Implementation ===

    this.get_info = function() {
        return {
                uri: "dm4.svgrenderer.svg_renderer",
                name: "SVG Topicmap"
        }
    }



    // === TopicmapRenderer Topicmaps Extension ===

    this.load_topicmap = function(topicmap_id, config) {
            return new Svgmap(topicmap_id, config)
    }

    this.display_topicmap = function(topicmap, no_history_update) {

        //First we need a "Mom" SVG element which has all visible elements as childs
        //We need to use createElementNS method because svg and html namespaces are not compatible
        //We are not able to use plain jquery!
        var newtmap = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        newtmap.setAttribute("id","Mom")
        this.dom.append(newtmap);

        //Now append all Topics as childs
        display_topics()
        display_associations()

        //then append the whole construct
        this.dom.append(newtmap);

        function display_topics() {
            topicmap.iterate_topics(function(topic) {
            topic.render('#Mom')
            })
        }



        function display_associations() {
            topicmap.iterate_associations(function(assoc) {

                assoc.render('#Mom')
            })
        }
    }

      /**
         * Updates an association. If the association is not on the canvas nothing is performed.
         */
         //let me be called by this
        this.update_association = function(assoc) {
            var ca = Svgmap.get_association(assoc.id)
            if (!ca) {
                return
            }

            alert("ping")
        }


           // === Selection ===

            /**
             * Selects a topic, that is it is rendered as highlighted.
             * If the topic is not present on the canvas nothing is performed. ### FIXDOC (explain): In this case
             * there is still a value returned.
             *
             * @return  an object with "select" and "display" properties (both values are Topic objects).
             */
            this.select_topic = function(topic_id) {}

            this.select_association = function(assoc_id) {}

            this.reset_selection = function(refresh_canvas) {}

            // ---

            this.scroll_topic_to_center = function(topic_id) {}

            this.begin_association = function(topic_id, x, y) {}

            this.refresh = function() {alert("refresh");}

            this.close_context_menu = function() {}

            // === Grid Positioning ===

            this.start_grid_positioning = function() {}

            this.stop_grid_positioning = function() {}



    // === Left SplitPanel Component Implementation ===

    this.init = function() {
    }

    this.resize = function(size) {
        this.dom.width(size.width).height(size.height)
        }

    this.resize_end = function() {

    }
}
