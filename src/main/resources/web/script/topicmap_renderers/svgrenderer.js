function SvgRenderer(){


   // ------------------------------------------------------------------------------------------------ Constructor Code

    js.extend(this, TopicmapRenderer)
https://github.com/joernweissenborn/dm4-svgrenderer/tree/master/src/main/resources/web/script/topicmap_renderers
    this.dom = $("<svg>", {id: "canvas"})
    
      // === TopicmapRenderer Implementation ===

    this.get_info = function() {
        return {
                uri: "dm4.webclient.svg_renderer",
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
