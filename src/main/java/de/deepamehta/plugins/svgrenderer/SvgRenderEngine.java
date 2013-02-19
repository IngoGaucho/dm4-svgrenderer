package de.deepamehta.plugins.svgrenderer;

import de.deepamehta.core.model.CompositeValueModel;
import de.deepamehta.plugins.topicmaps.TopicmapRenderer;

//First try to implement SVG Rendering

public class SvgRenderEngine implements TopicmapRenderer {
    @Override
    public String getUri() {
        return "dm4.svgrenderer.svg_renderer";
    }

    @Override
    public CompositeValueModel initialTopicmapState() {
        return new CompositeValueModel()
                .put("dm4.topicmaps.translation", new CompositeValueModel()
                        .put("dm4.topicmaps.translation_x", 0)
                        .put("dm4.topicmaps.translation_y", 0)
                );
    }
}

