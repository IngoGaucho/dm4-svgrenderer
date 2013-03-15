
    function SvgTopic(id, type_uri, value, x, y, visibility, glob_x, glob_y) {

        this.id = id
        this.type_uri = type_uri
        this.value = value
        this.x = x
        this.y = y
        this.visibility = visibility
        this.dom_id = "#"+id
        this.glob_x = glob_x
        this.glob_y = glob_y
        var self = this
        this.parent
        //Vars for kinetics
        var dragON = false
        var prevx = 0
        var prevy = 0
        var dx = 0
        var dy = 0
        var TrueCoords = null;

        //

         //Create new DOM element
             var domelement = document.createElementNS("http://www.w3.org/2000/svg","svg")
             domelement.setAttribute("id",this.id)




        this.show = function() {
            this.visibility = true
            this.render()
        }

        this.hide = function() {
            this.visibility = false
            this.remove()
            reset_selection()
        }

        this.move_to = function(x, y) {

            this.glob_x = x
            this.glob_y = y
            $("#"+id+"group").attr("transform","translate("
                             +this.getRealCoords().rx+
                             ","
                             +this.getRealCoords().ry+
                             ")")
        }

        /**
         * @param   topic   a Topic object
         */
        this.update = function(topic) {
            this.value = topic.value
        }

        this.remove = function() {
            $("#"+this.id).children().remove()
            $("#"+this.id).empty()
            $("#"+this.id).remove()
        }

        // ---

        function reset_selection() {
            if (self.is_topic_selected && self.selected_object_id == id) {
                self.selected_object_id = -1
            }
        }

    //The actual rendering stuff. This needs further abstraction!

    this.render = function (){
        //Create group to contain all childs. this makes placing and transforming independent of the rest of the SVG

        if(this.visibility){
        //if (document.getElementById(this.id) == false) { alert("bark") }
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g")
        //Named by convention :)
        group.setAttribute("id",this.id+"group")
        domelement.appendChild(group)
        group.setAttribute("transform","translate("+this.getRealCoords().rx+","+this.getRealCoords().ry+")")

        //From this part on one could draw nian cats, the model would happily drag her
        //over screen :)
        //function generate-svg() return SVG-Element

        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
        var radGrad = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
        radGrad.setAttribute("id","grad1")
        radGrad.setAttribute("cx","50%")
        radGrad.setAttribute("cy","50%")
        radGrad.setAttribute("r","50%")
        radGrad.setAttribute("fx","50%")
        radGrad.setAttribute("fy","50%")
        var stop = document.createElementNS("http://www.w3.org/2000/svg", "stop")
        stop.setAttribute("offset","0%")
        stop.setAttribute("style","stop-color:rgb(0,0,255);stop-opacity:1")
        radGrad.appendChild(stop)
        stop = document.createElementNS("http://www.w3.org/2000/svg", "stop")
        stop.setAttribute("offset","80%")
        stop.setAttribute("style","stop-color:rgb(0,171,255);stop-opacity:0.49")
        radGrad.appendChild(stop)
        stop = document.createElementNS("http://www.w3.org/2000/svg", "stop")
        stop.setAttribute("offset","100%")
        stop.setAttribute("style","stop-color:rgb(255,255,255);stop-opacity:0")
        radGrad.appendChild(stop)


        defs.appendChild(radGrad)
        group.appendChild(defs)

        //For now we do with a blue ball
        var ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ball.setAttribute("id",this.id+"ball")
        ball.setAttribute("cx", 0);
        ball.setAttribute("cy", 0);
        ball.setAttribute("r", "20");
        ball.setAttribute("fill","url(#grad1)");
        //ball.setAttribute("stroke","none");
        group.appendChild(ball)

        //And a Text with the topics value
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
        text.setAttribute("id",this.id+"text")
        text.setAttribute("x",0)
        text.setAttribute("y", 30);
        text.setAttribute("fill", "red");
        text.appendChild(document.createTextNode(this.value))
        group.appendChild(text)

        //now append this to our parent
        //and than everything to the canvas-dom
        $(this.parent).append(domelement)

    	this.connectAll();
    	}
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
        this.connect("contextmenu", this.contextmenu);
        this.connect("mouseout", this.onmouseout);
        this.connect("mousedown", this.onmousedown);
        this.connect("mouseup", this.onmouseup);
        this.connect("mousemove", this.onmousemove);
     }

    this.onmousedown = function(e) {
        dm4c.do_select_topic(id)
        if(e.button == 0 && !e.shiftKey) dragON = true
        prevx = e.x
        prevy = e.y
    }

    this.onmousemove = function(e) {
         if (dragON) {
             self.x = self.x+(e.x-prevx)
             self.y = self.y+(e.y-prevy)
             prevx = e.x
             prevy = e.y
             //$("#"+id+"text").text(cx+" "+cy)
             $("#"+id+"group").attr("transform","translate("
                 +self.getRealCoords().rx+
                 ","
                 +self.getRealCoords().ry+
                 ")")

         dm4c.fire_event("post_move_topic", new SvgTopic(id, type_uri, value, self.x, self.y, visibility))

         }
    }

    this.onmouseup = function(e) {
        dragOFF()
    }

    this.onmouseout = function(e) {
        dragOFF()
    }

    this.onclick = function(e) {
     dm4c.do_select_topic(id)
    }

    function dragOFF(){
        //$("#"+this.id+"text").text('dragstop')
        dragON = false


    }

    this.contextmenu = function(e) {
            e.preventDefault()
                    if($("#contextmenu").length==1) $("#contextmenu").remove()

            var menu = new ringmenu(self.getRealCoords().rx, self.getRealCoords().ry, self.parent, ["Edit","associate","retype","hide"])
            menu.render()
        }

    this.setParent = function(dom){
       this.parent = dom
    }

    this.getRealCoords = function() {
        var rx = this.x+this.glob_x
        var ry = this.y+this.glob_y
        return {"rx":rx,"ry": ry}
    }

        }