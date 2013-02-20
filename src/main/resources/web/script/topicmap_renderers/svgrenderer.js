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
        this.dom.append(newtmap);

        //Now append all Topics as childs
        display_topics()
        display_associations()

        //then append the whole construct
        this.dom.append(newtmap);

        function display_topics() {
            topicmap.iterate_topics(function(topic) {
            var topicelement = new TopicRenderer(topic)
            topicelement.render('#Mom')
            })
        }



        function display_associations() {
            topicmap.iterate_associations(function(assoc, ct1, ct2) {
                //var ct1 = topicmap.get_topic(assoc.topic_id_1)
                //var coords = ct1.x
                //var t1 = new Topic
                //var t1 = assoc.get_topic_1()
                alert(ct2.label)
                //var svgassoc = new Object()
                //svgassoc={orgassoc:assoc,ct1: t1.label}
                var assocelement = new AssocRenderer(assoc, ct1, ct2)
                assocelement.render('#Mom')
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
