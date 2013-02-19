dm4c.add_plugin("de.deepamehta.svgrenderer", function(){

dm4c.load_script("/de.deepamehta.svgrenderer/script/topicmap_renderers/svgrenderer.js")
dm4c.load_script("/de.deepamehta.topicmaps/script/model/topicmap.js")




 // === Topicmaps Listeners ===

    dm4c.add_listener("topicmap_renderer", function() {
        return new SvgRenderer()
    })
})