package de.deepamehta.plugins.svgrenderer;



import de.deepamehta.plugins.svgrenderer.SvgRenderer      ;

import de.deepamehta.plugins.topicmaps.service.TopicmapsService;


import de.deepamehta.core.Association;
import de.deepamehta.core.AssociationDefinition;
import de.deepamehta.core.RelatedTopic;
import de.deepamehta.core.ResultSet;
import de.deepamehta.core.Topic;
import de.deepamehta.core.TopicType;
import de.deepamehta.core.model.AssociationModel;
import de.deepamehta.core.model.CompositeValue;
import de.deepamehta.core.model.TopicModel;
import de.deepamehta.core.model.TopicRoleModel;
import de.deepamehta.core.osgi.PluginActivator;
import de.deepamehta.core.service.ClientState;
import de.deepamehta.core.service.Directives;
import de.deepamehta.core.service.PluginService;
import de.deepamehta.core.service.annotation.ConsumesService;
import de.deepamehta.core.service.event.PostCreateTopicListener;
import de.deepamehta.core.service.event.PostUpdateTopicListener;
import de.deepamehta.core.service.event.PreSendTopicListener;
import de.deepamehta.core.util.JavaUtils;

import org.codehaus.jettison.json.JSONObject;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.WebApplicationException;

import java.net.URL;
import java.util.List;
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
        topicmapsService.registerTopicmapRenderer(new SvgRenderer());
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

