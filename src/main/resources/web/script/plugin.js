dm4c.add_plugin("de.deepamehta.svgrenderer", function(){

dm4c.load_script("/de.deepamehta.svgrenderer/script/topicmap_renderers/svgrenderer_rewrite.js")
//dm4c.load_script("/de.deepamehta.svgrenderer/script/topicrenderer/topicrenderer.js")
//dm4c.load_script("/de.deepamehta.svgrenderer/script/topicrenderer/assocrenderer.js")

//dm4c.load_script("/de.deepamehta.svgrenderer/script/model/svgmodel.js")
//dm4c.load_script("/de.deepamehta.svgrenderer/script/model/SvgTopic.js")
//dm4c.load_script("/de.deepamehta.svgrenderer/script/model/svgassociation.js")
dm4c.load_script("/de.deepamehta.svgrenderer/script/model/blockmenu.js")


//Modell

 // === Topicmaps Listeners ===

    dm4c.add_listener("topicmap_renderer", function() {
        return new SvgRenderer()
    })
})
