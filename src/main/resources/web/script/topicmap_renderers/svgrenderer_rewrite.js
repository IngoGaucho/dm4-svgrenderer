/**
 * An abstraction of the view component that occupies the left part of the DeepaMehta window (the "canvas").
 * The abstraction comprises:
 *     - A model of the topics and association that are currently displayed.
 *     - A model for the current selection.
 *     - The view element (the "dom" property).
 *
 * The Webclient and the Topicmaps modules, as well as the SplitPanel are coded to this interface.
 *
 * Note: the concept of a (persistent) topicmap does not appear here.
 * It is only introduced by the Topicmaps module.
 */
function SvgRenderer() {


    js.extend(this, TopicmapRenderer)

    var self = this

    // Model
    var model = new DefaultTopicmapViewmodel()

    //dom
    this.dom = $("<div>", {id: "TopicmapDiv"})
    var svg_topicmap = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    var dom_id = "Topicmap"
    svg_topicmap.setAttribute("id", dom_id)


    // An invisible rect to have something to touch
    //svg_topicmap.setAttribute("x","0")
    //svg_topicmap.setAttribute("y","-25")
    //svg_topicmap.setAttribute("fill", "transparent");
    //svg_topicmap.setAttribute("stroke", "none");
    // ==

    this.get_info = function() {
        return {
            uri: "dm4.svgrenderer.svg_renderer",
            name: "SVG Topicmap"

        }
    }

    // === TopicmapRenderer Topicmaps Extension ===

    this.load_topicmap = function(topicmap_id, config) {
        return new Topicmap(topicmap_id, config)
    }

    this.display_topicmap = function(topicmap, no_history_update) {
        //Clear any previous DOMs
        if (svg_topicmap.hasChildNodes()){
            while ( svg_topicmap.childNodes.length >= 1 ){
                svg_topicmap.removeChild( svg_topicmap.firstChild );
            }

        }
        if($("#contextmenu").length==1) $("#contextmenu").remove()
        model.translate_by(topicmap.trans_x, topicmap.trans_y)

        alert("hello")
        this.dom.append(svg_topicmap);


        display_topics()
        display_associations()
        this.connectAll()

        function display_topics() {
            topicmap.iterate_topics(function(topic) {
                    if (topic.visibility) {
                        // Note: canvas.add_topic() expects an topic object with "value" property (not "label")
                        var t = {id: topic.id, type_uri: topic.type_uri, value: topic.label, x: topic.x, y: topic.y}
                        dm4c.canvas.add_topic(t)
                    }
            })
        }

        function display_associations() {
             topicmap.iterate_associations(function(assoc) {
                 var a = {
                     id: assoc.id,
                     type_uri: assoc.type_uri,
                     role_1: {topic_id: assoc.topic_id_1},
                     role_2: {topic_id: assoc.topic_id_2}
                     }
                     dm4c.canvas.add_association(a)
             })
        }
    }

    // ---

    /**
     * Adds a topic to the canvas. If the topic is already on the canvas it is not added again.
     * Note: the canvas is not refreshed.
     *
     * A canvas implementation may decide not to show the given topic but a different one or to show nothing at all.
     *
     * The given topic may or may not provide a geometry hint ("x" and "y" properties). In any case placement is up
     * to the canvas implementation.
     *
     * @param   topic       an object with "id", "type_uri", "value" properties and optional "x", "y" properties.
     * @param   do_select   Optional: if true, the topic is selected.
     *
     * @return  the topic actually shown including the geometry where it is actually shown (a Topic object with
     *          "x" and "y" properties) or "undefined" if no topic is shown.
     */
    this.add_topic = function(topic, do_select) {
        if (!model.topic_exists(topic.id)) {
            init_position()
            model.add_topic(topic)
            render_topic(topic)
        }
        //
        if (do_select) {
            model.set_highlight_topic(topic.id)
        }
        //
        return topic

        function init_position() {
            if (topic.x == undefined || topic.y == undefined) {
                topic.x = Math.floor(svg_topicmap.getAttribute("width")/2)
                topic.y = Math.floor(svg_topicmap.getAttribute("height")/2)
            }
        }
    }

    this.add_association = function(assoc, do_select) {
        if (!model.association_exists(assoc.id)) {
           render_assoc(assoc)
           model.add_association(assoc)
        }
         if (do_select) {
            model.set_highlight_association(assoc.id)
         }
    }

    this.update_topic = function(topic, refresh_canvas) {}

    this.update_association = function(assoc, refresh_canvas) {}

    this.remove_topic = function(topic_id, refresh_canvas) {}

    /**
     * Removes an association from the canvas (model) and optionally refreshes the canvas (view).
     * If the association is not present on the canvas nothing is performed.
     *
     * @param   refresh_canvas  Optional - if true, the canvas is refreshed.
     */
    this.remove_association = function(assoc_id, refresh_canvas) {}

    /**
     * Checks if a topic is visible on the canvas.
     *
     * @return  a boolean
     */
    this.topic_exists = function(topic_id) {}

    /**
     * Clears the model: removes all topics and associations and resets the selection.
     *
     * Note: if the underlying view element handles translation relatively (by distance) the renderer must
     * reset the translation. This applies to the HTML5 canvas (default topicmap renderer) but not to an
     * OpenLayers map (geomaps renderer).
     */
    this.clear = function() {

        model.translate_by(-model.trans_x, -model.trans_y)

        model.clear()

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
        // 1) fetch from DB
        var topic = dm4c.fetch_topic(topic_id)
        // 2) update model
        model.set_highlight_topic(topic_id)
        //
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

    // === Left SplitPanel Component ===

    /**
     * Called by the SplitPanel once this renderer has been added to the DOM.
     */
    this.init = function() {}

    /**
     * @param   size    an object with "width" and "height" properties.
     */
    this.resize = function(size) {
        //this.dom.width(size.width).height(size.height)
        svg_topicmap.setAttribute("width",size.width)
        svg_topicmap.setAttribute("height",size.height)
    }

    this.resize_end = function() {}



    // === Private Methods ===

    function render_topic(topic){
            //group
            var group = document.createElementNS("http://www.w3.org/2000/svg", "g")
            group.setAttribute("id",topic.id)
            group.setAttribute("transform","translate("
                +(topic.x+model.trans_x)
                +","
                +(topic.y+model.trans_y)
                +")"
            )

            //Image
            var icon_src = dm4c.get_icon_src(topic.type_uri)
            var ball = document.createElementNS("http://www.w3.org/2000/svg", "image");
            ball.setAttribute("id",topic.id+"img")
            ball.setAttributeNS("http://www.w3.org/1999/xlink","href","http://"+document.location.host+icon_src);
            ball.setAttribute("x",-16)
            ball.setAttribute("y",-16)
            ball.setAttribute("width", "32");
            ball.setAttribute("height","32");
            group.appendChild(ball)

            //Text

            var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
            text.setAttribute("id",topic.id+"text")
            text.setAttribute("x",-16)
            text.setAttribute("y", 32);
            text.setAttribute("fill", "black");
            text.appendChild(document.createTextNode(topic.value))
            group.appendChild(text)

            //Append to parent

            $("#"+dom_id).append(group)

    }


    function render_assoc(assoc){
        //Vars for drawing

        var t1
        if(!model.get_topic(assoc.role_1.topic_id)){
            t1 = init_position()
        } else {t1 = model.get_topic(assoc.role_1.topic_id)}
        var t2
        if(!model.get_topic(assoc.role_2.topic_id)){
            t2 = init_position()
        } else {t2 = model.get_topic(assoc.role_2.topic_id)}

        var angle = Math.atan((t2.y-t1.y)/(t2.x-t1.x))*180/Math.PI
        var length = Math.sqrt(Math.pow(t2.y-t1.y,2)+Math.pow(t2.x-t1.x,2))
        if (t1.x>t2.x) angle = 180+angle
        var color
        if (assoc.type_uri) color = dm4c.get_type_color(assoc.type_uri)
        if (!color) color = "grey"
        //group
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g")
        group.setAttribute("id",assoc.id)
        group.setAttribute("transform","translate("
                           +(model.trans_x+t1.x)+
                           ","
                           +(model.trans_y+t1.y)+
                           ") rotate("
                           +angle+
                           ", 0, 0)"
                           )

        //Line

        var assocline = document.createElementNS("http://www.w3.org/2000/svg", "path");
        assocline.setAttribute("id",assoc.id+"line")
        assocline.setAttribute("d", "M0,0 L"+length+",0")
        assocline.setAttribute("stroke", color);
        assocline.setAttribute("stroke-width", "6");
        assocline.setAttribute("fill", "none");
        group.appendChild(assocline)

        // An invisible rect to have something to touch
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("id",assoc.id+"touchblock")
        rect.setAttribute("x","0")
        rect.setAttribute("y","-25")
        rect.setAttribute("width",length)
        rect.setAttribute("height","50")
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("stroke", "none");
        group.appendChild(rect)

        //Append to parent

        $("#"+dom_id).prepend(group)

        function init_position() {
            var x = Math.floor(svg_topicmap.getAttribute("width")/2)
            var y = Math.floor(svg_topicmap.getAttribute("height")/2)
            return {x: x, y: y}
        }
    }

    function render_temporary_assoc(topic, dx,dy){
        //Vars for drawing

        var angle = Math.atan((dy-topic.y)/(dx-topic.x))*180/Math.PI
        var length = Math.sqrt(Math.pow(dy-topic.y,2)+Math.pow(dx-topic.x,2))
        if (topic.x>dx) angle = 180+angle
        var color = "grey"
        //group
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g")
        group.setAttribute("id","tempassoc")
        group.setAttribute("transform","translate("
                           +(model.trans_x+topic.x)+
                           ","
                           +(model.trans_y+topic.y)+
                           ") rotate("
                           +angle+
                           ", 0, 0)"
                           )

        //Line

        var assocline = document.createElementNS("http://www.w3.org/2000/svg", "path");
        assocline.setAttribute("id","tempassocline")
        assocline.setAttribute("d", "M0,0 L"+length+",0")
        assocline.setAttribute("stroke", color);
        assocline.setAttribute("stroke-width", "6");
        assocline.setAttribute("fill", "none");
        group.appendChild(assocline)

        //Append to parent

        $("#"+dom_id).prepend(group)
    }

    function remove_temporary_assoc(){
        $("#tempassoc").remove()
    }

    function move_topic(topic, dx, dy){
        $("#"+topic.id).attr("transform","translate("
                +(topic.x+model.trans_x)
                +","
                +(topic.y+model.trans_y)
                +")")
        var cas = model.get_associations(topic.id)
        for (var i = 0, ca; ca = cas[i]; i++) {
            move_assoc(ca)
        }
    }

    function move_assoc(assoc) {
        var t1 = model.get_topic(assoc.role_1.topic_id)
        var t2 = model.get_topic(assoc.role_2.topic_id)
        var angle = Math.atan((t2.y-t1.y)/(t2.x-t1.x))*180/Math.PI
        var length = Math.sqrt(Math.pow(t2.y-t1.y,2)+Math.pow(t2.x-t1.x,2))
        if (t1.x>t2.x) angle = 180+angle
        $("#"+assoc.id).attr("transform","translate("
                                   +(model.trans_x+t1.x)+
                                   ","
                                   +(model.trans_y+t1.y)+
                                   ") rotate("
                                   +angle+
                                   ", 0, 0)"
                                   )
        $("#"+assoc.id+"line").attr("d", "M0,0 L"+length+",0")
        $("#"+assoc.id+"touchblock").attr("width",length)
    }

    function move_temporary_assoc(topic,dx,dy) {
        var angle = Math.atan((dy)/(dx))*180/Math.PI
        var length = Math.sqrt(Math.pow(dy,2)+Math.pow(dx,2))
        if (dx<0) angle = 180+angle
        $("#tempassoc").attr("transform","translate("
                                   +(model.trans_x+topic.x)+
                                   ","
                                   +(model.trans_y+topic.y)+
                                   ") rotate("
                                   +angle+
                                   ", 0, 0)"
                                   )
        $("#tempassocline").attr("d", "M0,0 L"+length+",0")

    }

    function move_canvas(dx, dy){
        model.iterate_topics(function(ct){
            move_topic(ct,dx,dy)
        })
    }


    /**
     * @param   id  the id of the topic or the assoc
     */

    function clear_topic_or_assoc(id) {}

    //=== Eventhandling Helper Functions ====

    this.connect = function(event, listener) {
       	if (listener != null) {
     	    this.dom.bind(event, listener);
       	}
    }

    this.connectAll = function() {
       	this.connect("click", this.onmouseup); //mouseup isn't fired upon click in ffox
        //this.connect("dblclick", this.ondblclick);
        //this.connect("mouseover", this.onmouseover);
        this.connect("contextmenu", this.contextmenu);
        this.connect("mouseout", this.onmouseout);
        this.connect("mousedown", this.onmousedown);
        this.connect("mouseup", this.onmouseup);
        this.connect("mousemove", this.onmousemove);
        this.dom.bind("dragstart", function() {return false}) //prevent ffox default drag
    }

    // === Events ===

    // Kinetics
    var drag_topic = false
    var drag_cluster = false
    var drag_topicmap = false
    var target_id
    var cluster
    var action_topic
    var cx = 0
    var cy = 0
    var prevx, prevy
    var assoc_draw = false

    this.onmousedown = function(e) {
        prevx = e.clientX
        prevy = e.clientY
        target_id = e.target.id.match(/[0-9]+/)
        if(target_id){
            if(model.topic_exists(target_id)){
                action_topic= model.get_topic(target_id)
                dm4c.do_select_topic(target_id)
                if(e.shiftKey){
                    render_temporary_assoc(action_topic,action_topic.x,action_topic.y)
                    assoc_draw = true
                }
                else {
                    drag_topic = true
                }
            } else if(model.association_exists(target_id)){
                dm4c.do_select_association(target_id)
                cluster = cluster || model.create_cluster(model.get_association(target_id))
                drag_cluster = true
            }
        } else {
            drag_topicmap = true
        }
    }

    this.onmouseup = function(e) {
        var target = e.target.id.match(/[0-9]+/)
        drag_end(target)
        if($("#contextmenu").length==1) $("#contextmenu").remove()
    }

    function drag_end(target){
        if (drag_topic) {
            drag_topic = false
            dm4c.fire_event("post_move_topic", model.get_topic(target_id))
        }else if (drag_cluster) {
            drag_cluster = false
            dm4c.fire_event("post_move_cluster", cluster)
        }else if (drag_topicmap) {
            drag_topicmap = false
            dm4c.fire_event("post_move_canvas", model.trans_x, model.trans_y)
        }else if (assoc_draw){
            remove_temporary_assoc()
            assoc_draw = false
            if(target){
                var topic = dm4c.fetch_topic(target)
                dm4c.do_create_association("dm4.core.association", topic)
            }
        }
    }



    this.onmousemove = function(e) {
        var dx = (e.clientX-prevx)
        var dy = (e.clientY-prevy)
        if(assoc_draw){
            move_temporary_assoc(action_topic,dx,dy)
            return
        }else if(drag_topic){
            action_topic.move_by(dx, dy)
            move_topic(action_topic,dx,dy)
        } else if (drag_cluster) {
            cluster.move_by(dx, dy)
            cluster.iterate_topics(function(ct){
                move_topic(ct,dx,dy)
            })
        } else if (drag_topicmap) {
           move_canvas(dx, dy)
           model.translate_by(dx, dy)
        }

        prevx = e.clientX
        prevy = e.clientY
    }

    this.onmouseout = function(e) {
        e.preventDefault()
    }

}