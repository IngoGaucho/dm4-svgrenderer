function blockmenu(x, y, parent, commands) {

//how to svg: arc, coords von kreis fkt
    this.x = x
    this.y = y
    this.parent = parent
    this.id = "contextmenu"
    var self = this




    var domelement = document.createElementNS("http://www.w3.org/2000/svg","svg")
    domelement.setAttribute("id",this.id)

    var elements = {}
    var width = 0

    this.render = function(){
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g")
        //Named by convention :)
        group.setAttribute("id",this.id+"group")
        domelement.appendChild(group)
        group.setAttribute("transform","translate("+this.x+","+this.y+")")
        $(this.parent).append(domelement)

        for (var i = 0, cmd; cmd = commands[i]; i++) {
            if(cmd.label){
                elements[cmd.label] = new menu_item(i, cmd.label, group)
                elements[cmd.label].render_item_text()
            }
        }
        for (var i = 0, cmd; cmd = commands[i]; i++) {
            if(cmd.label){
                elements[cmd.label].render_item_box(width)
            }
        }

        //group.appendChild(render_item())

        this.connectAll()

    }

    //menue items modell

    function menu_item(i, name, group){
        //subgroup for item
        var piecentext = document.createElementNS("http://www.w3.org/2000/svg", "g")
        piecentext.setAttribute("id", name);
        this.render_item_text = function (){

            //item text
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
            text.setAttribute("id", name+":text");
            text.setAttribute("fill", "black");
            text.setAttribute("font-size", "12");
            text.setAttribute("x", "16")
            text.setAttribute("y", 28+i*16);
            text.appendChild(document.createTextNode(name))
            piecentext.appendChild(text)
            group.appendChild(piecentext)
            //needed for boxrendering, finding the largest element
            item_width = document.getElementById(name+":text").getComputedTextLength()

            if (item_width>width) width = item_width
            }

        this.render_item_box = function(width){
            var piece = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            piece.setAttribute("id", name+":box");
            piece.setAttribute("x", "0");
            piece.setAttribute("y", i*16);
            piece.setAttribute("width", 32+width);
            piece.setAttribute("height", "32");
            piece.setAttribute("stroke-width", "4");
            piece.setAttribute("stroke", "black");
            piece.setAttribute("fill", "white");
            piecentext.insertBefore(piece,piecentext.firstChild)
        }

    }

    //== Eventhandling Helper Functions

    this.connect = function(event, listener) {
       	if (listener != null) {
            for (var i = 0, cmd; cmd = commands[i]; i++) {
     	        if(cmd.label) $("#"+cmd.label).bind(event, listener);
     	    }
       	}
    }

    this.connectAll = function() {
       	this.connect("mousedown", this.onmousedown);
        //this.connect("dblclick", this.ondblclick);
        //this.connect("mouseover", this.onmouseover);
        //this.connect("contextmenu", this.contextmenu);
        //this.connect("mouseout", this.onmouseout);
        //this.connect("mousedown", this.onmousedown);
        this.connect("mouseup", this.onmouseup);
        //this.connect("mousemove", this.onmousemove);
    }

    this.onmousedown =function(e){
        for (var i = 0, cmd; cmd = commands[i]; i++) {
            var target = e.target.id.match(/[^:]+:/).toString()
            target = target.substring(0,target.length-1)
            if (target==cmd.label) {
                cmd.handler(e.originalEvent.layerX, e.originalEvent.layerY)
            }
        }

    }
    var firstcall = true
    this.onmouseup =function(e){
        if (firstcall){
            firstcall = false
            return
        }
        $("#contextmenu").remove()
    }



}

