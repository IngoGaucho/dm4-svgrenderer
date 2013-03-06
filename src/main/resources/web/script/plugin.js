dm4c.add_plugin("de.deepamehta.svgrenderer", function(){

dm4c.load_script("/de.deepamehta.svgrenderer/script/topicmap_renderers/svgrenderer.js")
dm4c.load_script("/de.deepamehta.svgrenderer/script/topicrenderer/topicrenderer.js")
dm4c.load_script("/de.deepamehta.svgrenderer/script/topicrenderer/assocrenderer.js")

dm4c.load_script("/de.deepamehta.svgrenderer/script/model/svgmodel.js")
dm4c.load_script("/de.deepamehta.svgrenderer/script/model/SvgTopic.js")
dm4c.load_script("/de.deepamehta.svgrenderer/script/model/svgassociation.js")


//Modell

var svg_renderers = {}
 // === Topicmaps Listeners ===
   dm4c.add_listener("init", function() {

    function register_topicmap_renderers() {
                // default renderer
                // custom renderers
                var renderers = dm4c.fire_event("topicmap_renderer")
                renderers.forEach(function(renderer) {
                    if(renderer.uri == "dm4.svgrenderer.svg_renderer"){
                        register(renderer)
                    }
                })


                function register(renderer) {
                    svg_renderer[renderer.get_info().uri] = renderer
                }
            }
            })

    dm4c.add_listener("topicmap_renderer", function() {
        return new SvgRenderer()
    })



})
