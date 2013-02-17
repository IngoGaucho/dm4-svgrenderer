package de.deepamehta.plugins.svgrenderer;


import de.deepamehta.core.osgi.PluginActivator;
import de.deepamehta.core.service.PluginService;
import de.deepamehta.core.service.annotation.ConsumesService;
import de.deepamehta.plugins.topicmaps.service.TopicmapsService;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.logging.Logger;


@Path("/svgrenderer")
@Consumes("application/json")
@Produces("application/json")
public class SvgrendererPlugin extends PluginActivator {

    // ---------------------------------------------------------------------------------------------- Instance Variables

    private TopicmapsService topicmapsService;
    private Logger logger = Logger.getLogger(getClass().getName());

    // -------------------------------------------------------------------------------------------------- Public Methods
    // ****************************
    // *** Hook Implementations ***
    // ****************************

    @Override
    public void init() {
        topicmapsService.registerTopicmapRenderer(new SvgRenderEngine());
    }

    @Override
    @ConsumesService({
            "de.deepamehta.plugins.topicmaps.service.TopicmapsService"
    })
    public void serviceArrived(PluginService service) {
        if (service instanceof TopicmapsService) {
            topicmapsService = (TopicmapsService) service;
        }
    }

    @Override
    public void serviceGone(PluginService service) {
        if (service == topicmapsService) {
            topicmapsService = null;
        }
    }


}

