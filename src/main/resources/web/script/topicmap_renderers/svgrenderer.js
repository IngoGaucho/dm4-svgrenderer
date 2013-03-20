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
        if($("#contextmenu").length==1) $("#contextmenu").remove()
        if(actual_map) actual_map.clear()
        actual_map = new Svgmap(topicmap_id, config)
        return actual_map
    }

    this.display_topicmap = function(topicmap, no_history_update) {
        this.dom.append(svg_topicmap);

        display_topics()
        display_associations()
        this.connectAll()

        function display_topics() {
            topicmap.iterate_topics(function(topic) {
            topic.parent = "#"+dom_id
            topic.render()
            })
        }

        function display_associations() {
            topicmap.iterate_associations(function(assoc) {
                assoc.parent = "#"+dom_id
                assoc.render()         //let me be called by this

            })
        }
    }

      /**
         * Updates an association. If the association is not on the canvas nothing is performed.
         */
        this.update_association = function(assoc) {

        }


           // === Selection ===

            /**
             * Selects a topic, that is it is rendered as highlighted.
             * If the topic is not present on the canvas nothing is performed. ### FIXDOC (explain): In this case
             * there is still a value returned.
             *
             * @return  an object with "select" and "display" properties (both values are Topic objects).
             */
            this.select_topic = function(topic_id) {
                    var topic = dm4c.fetch_topic(topic_id)

                    return {select: topic, display: topic}

            }

            this.select_association = function(assoc_id) {
                // 1) fetch from DB
                var assoc = dm4c.fetch_association(assoc_id)
                return assoc

            }

            this.reset_selection = function(refresh_canvas) {}

            // ---

            this.scroll_topic_to_center = function(topic_id) {}

            this.begin_association = function(topic_id, x, y) {}

            this.refresh = function() {}

            this.close_context_menu = function() {}

            this.remove_topic = function(id, refresh_canvas) {
                actualmap.hide(id)
            }



    // === Left SplitPanel Component Implementation ===

    this.init = function() {
    }
    this.resize = function(size) {
        this.dom.width(size.width).height(size.height)
        }

    this.resize_end = function() {

    }

    this.add_topic = function(topic, do_select) {
        topic.x = 0
        topic.y = 0
        actual_map.add_topic(topic.id, topic.type_uri, topic.value, topic.x , topic.y, "#"+dom_id)
        return topic
    }

    this.add_association = function(assoc, do_select) {
            // update model

            if (!actual_map.is_assoc_on_map(assoc.id)) {

                actual_map.add_association(assoc.id, assoc.type_uri, assoc.role_1.topic_id, assoc.role_2.topic_id,"#"+dom_id)

            }
            //
            if (do_select) {
    //            model.set_highlight_association(assoc.id)
            }
    }

        this.update_topic = function(topic, refresh_canvas) {



    }
    //== Eventhandling Helper Functions

    this.connect = function(event, listener) {
       	if (listener != null) {
     	    this.dom.bind(event, listener);
       	}
    }

    this.connectAll = function() {
       	//this.connect("click", this.onclick);
        //this.connect("dblclick", this.ondblclick);
        //this.connect("mouseover", this.onmouseover);
        this.connect("contextmenu", this.contextmenu);
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
    var assoc_draw = false
    var source_id

    function dragEnd(){
        drag = false
    }
    this.onmouseout = function(e) {
        if (e.target == document.getElementById(dom_id)){
            drag = false
            //#FIXME: We need assoc_draw = false, but this event fires on entering assocs doms for example
            // Now we have the bug that assoc drawing doesnt end on leaving topicmap
        }
    }

    this.onmouseup = function(e) {
        if(e.button == 0){
        drag = false
        if(assoc_draw){
            assoc_draw = false
            actual_map.delete_tmp_assoc()
            if($("#"+e.target.id).parent().parent().attr("id")){
                var topic = dm4c.fetch_topic($("#"+e.target.id).parent().parent().attr("id"))
                dm4c.do_create_association("dm4.core.association", topic)

            }
        }
        if($("#contextmenu").length==1){
                        $("#contextmenu").remove()
                        if ($(e.target).parent().attr("id")=="hide") actual_map.hide(source_id)
                        if ($(e.target).parent().attr("id")=="Web"){
                            dm4c.create_topic
                                 dm4c.fire_event("post_show_topic", new SvgTopic(id, type_uri, value, self.x, self.y, visibility))
                        }
                        //if ($(e.target).parent().attr("id")=="delete") actual_map.delete_item(source_id)
                        if ($(e.target).parent().attr("id")=="associate"){
                            start_assoc(e.offsetX,e.offsetY)
                        }
        }
        }
    }


    this.onmousemove = function(e) {
       if (e.target == document.getElementById(dom_id)){
             if (drag) {
                 cx = (e.offsetX-prevx)
                 cy = (e.offsetY-prevy)
                 prevx = e.offsetX
                 prevy = e.offsetY
                 dm4c.fire_event("post_move_canvas", cx, cy)
             } else if (assoc_draw){
                draw_temp_assoc(source_id, e.offsetX, e.offsetY)
             }
       }
    }
    this.onmousedown = function(e) {
            if (e.target == document.getElementById(dom_id) && !e.shiftKey && e.button == 0){
                drag = true
                if($("#contextmenu").length==1) $("#contextmenu").remove()
                prevx = e.offsetX
                prevy = e.offsetY
            }else if(e.target != document.getElementById(dom_id) && e.shiftKey){
                //alert(e.offsetY)
                start_assoc(e.offsetX, e.offsetY)
            }
        }

    function start_assoc(x,y){
        source_id = dm4c.selected_object.id
        draw_temp_assoc(source_id, x, y)
        assoc_draw = true
    }

    this.contextmenu = function(e) {
        e.preventDefault()

        if (e.target == document.getElementById(dom_id)){
            if($("#contextmenu").length==1) $("#contextmenu").remove()
            var items = new Array
            var commands = dm4c.get_canvas_commands(e.offsetX, e.offsetY, "context-menu")

            var menu = new blockmenu(e.offsetX, e.offsetY, "#"+dom_id, commands)
            menu.render()
        }else{
           source_id = dm4c.selected_object.id
        }
    }


    function draw_temp_assoc(start_id,x2,y2){
        actual_map.render_tmp_assoc(start_id,x2,y2,"#"+dom_id)

    }
}
