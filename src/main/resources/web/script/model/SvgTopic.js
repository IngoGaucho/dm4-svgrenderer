
    function SvgTopic(id, type_uri, label, x, y, visibility) {

        this.id = id
        this.type_uri = type_uri
        this.label = label      // ### FIXME: rename to "value"
        this.x = x
        this.y = y
        this.visibility = visibility
        this.dom_id = "#"+id

        //Vars for kinetics
        var dragON = false
        var prevx = 0
        var prevy = 0
        var dx = 0
        var dy = 0
        var TrueCoords = null;
        var cx = this.x
        var cy = this.y
        //

         //Create new DOM element
             var domelement = document.createElementNS("http://www.w3.org/2000/svg","svg")
             domelement.setAttribute("id",this.dom_id)




        this.show = function() {
            this.visibility = true
        }

        this.hide = function() {
            this.visibility = false
            reset_selection()
        }

        this.move_to = function(x, y) {
            this.x = x
            this.y = y
        }

        /**
         * @param   topic   a Topic object
         */
        this.update = function(topic) {
            //this.label = topic.value
        }

        this.remove = function() {
            // Note: all topic references are deleted already
            delete topics[id]
            reset_selection()
        }

        // ---

        function reset_selection() {
            if (self.is_topic_selected && self.selected_object_id == id) {
                self.selected_object_id = -1
            }
        }

    //The actual rendering stuff. This needs further abstraction!

    this.render = function (parentID){

        //Create group to contain all childs. this makes placing and transforming independent of the rest of the SVG
        group = document.createElementNS("http://www.w3.org/2000/svg", "g")
        //Named by convention :)
        group.setAttribute("id",this.id+"group")
        group.setAttribute("transform","translate("+this.x+","+this.y+")")

        //From this part on one could draw nian cats, the model would happily drag her
        //over screen :)
        //function generate-svg() return SVG-Element

        //For now we do with a blue ball
        var ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ball.setAttribute("id",this.id+"ball")
        ball.setAttribute("cx", 0);
        ball.setAttribute("cy", 0);
        ball.setAttribute("r", "20");
        ball.setAttribute("fill", "#336699");
        group.appendChild(ball)

        //And a Text with the topics value
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
        text.setAttribute("id",this.id+"text")
        text.setAttribute("x",0)
        text.setAttribute("y", 30);
        text.setAttribute("fill", "red");
        text.appendChild(document.createTextNode(this.label))
        group.appendChild(text)

        //now append this to our parent
        domelement.appendChild(group)
        //and than everything to the canvas-dom
        $(parentID).append(domelement)
    	this.connectAll();
    }

    //Eventhandling Helper Functions

    this.connect = function(event, listener) {
    	if (listener != null) {
       	    domelement.addEventListener(event, listener);
    	}
    }

    this.connectAll = function() {
    	this.connect("click", this.onclick);
        //this.connect("dblclick", this.ondblclick);
        //this.connect("mouseover", this.onmouseover);
        this.connect("mouseout", this.onmouseout);
        this.connect("mousedown", this.onmousedown);
        this.connect("mouseup", this.onmouseup);
        this.connect("mousemove", this.onmousemove);
    }

    this.onmousedown = function(e) {
        //$('#'+id+"text").text('dragstart')
        dragON = true
        prevx = e.x
        prevy = e.y
    }

    this.onmousemove = function(e) {
         if (dragON) {
             cx = cx+(e.x-prevx)
             cy = cy+(e.y-prevy)
             prevx = e.x
             prevy = e.y
             //$("#"+id+"text").text(cx+" "+cy)
             $("#"+id+"group").attr("transform","translate("
                 +cx+
                 ","
                 +cy+
                 ")")

         this.x = cx
         this.y = cy
         dm4c.fire_event("post_move_topic", new SvgTopic(id, type_uri, label, cx, cy, visibility))

         }
    }

    this.onmouseup = function(e) {
        dragOFF()
    }

    this.onmouseout = function(e) {
        dragOFF()
    }

    this.onclick = function(e) {
        //alert("Hello World!");
        //$("#"+topic.id+"ball").attr("fill","blue")
    }

    function dragOFF(){
        //$("#"+this.id+"text").text('dragstop')
        dragON = false

    }
}