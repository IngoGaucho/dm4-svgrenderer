function SvgRenderer(){


   // ------------------------------------------------------------------------------------------------ Constructor Code

    js.extend(this, TopicmapRenderer)

    this.dom = $("<svg>", {id: "canvas"})

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

        }


}