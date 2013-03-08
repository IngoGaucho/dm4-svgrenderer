function SvgRenderer(){


   // ------------------------------------------------------------------------------------------------ Constructor Code

    js.extend(this, TopicmapRenderer)
    this.dom = $("<div>", {id: "canvas"})
    var actual_map

    //Construct dom
    var svg_topicmap = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    var dom_id = "Iamacoordinatesystemoriginsonobodyneedstostaple"
    svg_topicmap.setAttribute("id",dom_id)


      // === TopicmapRenderer Implementation ===

    this.get_info = function() {
        return {
                uri: "dm4.svgrenderer.svg_renderer",
                name: "SVG Topicmap"
        }
    }



    // === TopicmapRenderer Topicmaps Extension ===

    this.load_topicmap = function(topicmap_id, config) {
        if(actual_map){
            actual_map.clear()
        }
        actual_map = new Svgmap(topicmap_id, config)
        return actual_map
    }

    this.display_topicmap = function(topicmap, no_history_update) {
        this.dom.append(svg_topicmap);

        //Now append all Topics as childs
        display_topics()
        display_associations()
        this.connectAll()

        function clear_dom(dom){
            while (dom.lastChild) {
                dom.removeChild(dom.lastChild);
            }
        }




        function display_topics() {
            topicmap.iterate_topics(function(topic) {
            topic.parent = "#"+dom_id
            topic.render()
            })
        }



        function display_associations() {
            topicmap.iterate_associations(function(assoc) {
                assoc.parent = "#"+dom_id
                assoc.render()
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




    // === Left SplitPanel Component Implementation ===

    this.init = function() {
    }
              //#TODO:Redraw geht nich
    this.resize = function(size) {
        this.dom.width(size.width).height(size.height)
        }

    this.resize_end = function() {

    }

    //== Eventhandling Helper Functions

    this.connect = function(event, listener) {
       	if (listener != null) {
     	    svg_topicmap.addEventListener(event, listener);
       	}
    }

    this.connectAll = function() {
       	//this.connect("click", this.onclick);
        //this.connect("dblclick", this.ondblclick);
        //this.connect("mouseover", this.onmouseover);
        this.connect("mouseout", this.onmouseout);
        this.connect("mousedown", this.onmousedown);
        this.connect("mouseup", this.onmouseup);
        this.connect("mousemove", this.onmousemove);
}

    //== Eventhandlers

    // Kinetics
    var drag = false
    var cx = 0
    var cy = 0
    var prevx, prevy

    function dragEnd(){
        drag = false
    }
    this.onmouseout = function(e) {
            if(drag){dragEnd()}
    }

    this.onmouseup = function(e) {
        if(drag){dragEnd()}
    }


    this.onmousemove = function(e) {
             if (drag) {
                 cx = (e.x-prevx)
                 cy = (e.y-prevy)
                 prevx = e.x
                 prevy = e.y
                 dm4c.fire_event("post_move_canvas", cx, cy)

              }
    }
    this.onmousedown = function(e) {

            if (e.target == document.getElementById(dom_id)){
                drag = true
                prevx = e.x
                prevy = e.y
            }
        }


}
