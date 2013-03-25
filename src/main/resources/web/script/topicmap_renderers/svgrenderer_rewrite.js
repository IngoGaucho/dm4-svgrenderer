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
    var model = new DefaultTopicmapRenderer.Model()

    //dom
    this.dom = $("<svg>", {id: "Topicmap"})
    var dom_id = "Topicmap"


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
        if($("#contextmenu").length==1) $("#contextmenu").remove()




        display_topics()
        display_associations()
        this.connectAll()

        function display_topics() {
            topicmap.iterate_topics(function(topic) {
                    if (topic.visibility) {
                        alert(topic.label)
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
            model.add_topic(topic)
            render_topic(topic)
        }
        //
        if (do_select) {
            model.set_highlight_topic(topic.id)
        }
        //
        return topic
    }

    this.add_association = function(assoc, do_select) {
        if (!model.association_exists(assoc.id)) {
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
    this.clear = function() {}

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

    this.refresh = function() {}

    this.close_context_menu = function() {}

    // === Grid Positioning ===

    this.start_grid_positioning = function() {}

    this.stop_grid_positioning = function() {}

    // === Left SplitPanel Component ===

    /**
     * Called by the SplitPanel once this renderer has been added to the DOM.
     */
    this.init = function() {}

    /**
     * @param   size    an object with "width" and "height" properties.
     */
    this.resize = function(size) {}

    this.resize_end = function() {}



    // === Private Methods ===

    function render_topic(topic){
        if(this.visibility){
            //group
            var group = document.createElementNS("http://www.w3.org/2000/svg", "g")
            group.setAttribute("id",topic.id)
            group.setAttribute("transform","translate("
                +topic.x+model.trans_x
                +","
                +topic.y+model.trans_y
                +")"
            )

            //Image
            var icon_src = dm4c.get_icon_src(type_uri)
            var ball = document.createElementNS("http://www.w3.org/2000/svg", "image");
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

            $("#"+self.dom_id).append(group)
        }
    }


    function render_assoc(assoc){
        //Vars for drawing
        alert(assoc.topic_id_1)
        var t1 = model.get_topic(assoc.topic_id_1)
        var t2 = model.get_topic(assoc.topic_id_2)
        var angle = Math.atan((t2.y-t1.y)/(t2.x-t1.x1))*180/Math.PI
        var length = Math.sqrt(Math.pow(t2.y-t1.y,2)+Math.pow(t2.x-t1.x,2))
        if (this.x1>this.x2) angle = 180+angle
        if (type_uri) color = dm4c.get_type_color(type_uri)
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
        assocline.setAttribute("id", topic_id_1+" und "+topic_id_2)
        assocline.setAttribute("d", "M0,0 L"+length+",0")
        assocline.setAttribute("stroke", color);
        assocline.setAttribute("stroke-width", "6");
        assocline.setAttribute("fill", "none");
        group.appendChild(assocline)

        // An invisible rect to have something to touch
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x","0")
        rect.setAttribute("y","-25")
        rect.setAttribute("width",length)
        rect.setAttribute("height","50")
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("stroke", "none");
        group.appendChild(rect)

        //Append to parent

        $("#"+self.dom_id).append(group)

    }

    function move_topic(topic){

    }

    function move_assoc(assoc) {}

    /**
     * @param   id  the id of the topic or the assoc
     */

    function clear_topic_or_assoc(id) {}
    // === Events ===


}