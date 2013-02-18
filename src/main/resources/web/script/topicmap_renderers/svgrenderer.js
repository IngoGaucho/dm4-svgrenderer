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
            return new Topicmap(topicmap_id, config)
    }

    this.display_topicmap = function(topicmap, no_history_update) {

        //First we need a "Mom" SVG element which has all visible elements as childs
        //We need to use createElementNS method because svg and html namespaces are not compatible
        //We are not able to use plain jquery!
        var newtmap = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        newtmap.setAttribute("id","Mom")

        //Now append all Topics as childs
        display_topics()

        //then append the whole construct
        this.dom.append(newtmap);

        function display_topics() {
            topicmap.iterate_topics(function(topic) {
                var newelement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                newelement.setAttribute("id",topic.id)
                var ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                ball.setAttribute("cx", topic.x);
                ball.setAttribute("cy", topic.y);
                ball.setAttribute("r", "20");
                ball.setAttribute("fill", "#336699");
                newelement.appendChild(ball)
                var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
                text.setAttribute("x",topic.x)
                text.setAttribute("y", topic.y-30);
                text.setAttribute("fill", "red");
                text.appendChild(document.createTextNode(topic.label))
                newelement.appendChild(text)

                newtmap.appendChild(newelement)

            })
        }
    }

    // === Left SplitPanel Component Implementation ===

    this.init = function() {
    }

    this.resize = function(size) {
        this.dom.width(size.width).height(size.height)
        }

    this.resize_end = function() {

    }
}
