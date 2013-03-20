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

    this.remove = function() {
       $("#"+this.id).children().remove()
       $("#"+this.id).empty()
       $("#"+this.id).remove()
    }

    this.render = function(){
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g")
        //Named by convention :)
        group.setAttribute("id",this.id+"group")
        domelement.appendChild(group)
        group.setAttribute("transform","translate("+this.x+","+this.y+")")


        //From this part on one could draw nian cats, the model would happily drag her
        //over screen :)
        //TODO: this shoulb be a function generate-svg() return SVG-Element


        for (var i = 0, cmd; cmd = commands[i]; i++) {
            if(cmd.label){
                elements[cmd.label] = new menu_item(i, cmd.label, group)
                elements[cmd.label].render_item()
            }
        }

        //group.appendChild(render_item())

        $(this.parent).append(domelement)
        this.connectAll()


    }

    //menue items modell

    function menu_item(i, name, group){

        this.name = name

        this.render_item = function (){

                                var piecentext = document.createElementNS("http://www.w3.org/2000/svg", "g")

                var piece = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                piecentext.setAttribute("id", name);
                piece.setAttribute("x", "0");
                piece.setAttribute("y", i*16);
                piece.setAttribute("width", "100");
                piece.setAttribute("height", "32");
                piece.setAttribute("stroke-width", "4");
                piece.setAttribute("stroke", "black");
                piece.setAttribute("fill", "white");



                var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
                text.setAttribute("fill", "black");
                text.setAttribute("x", "16")
                text.setAttribute("y", 28+i*16);
                text.appendChild(document.createTextNode(name))
                piecentext.appendChild(piece)
                piecentext.appendChild(text)
                group.appendChild(piecentext)
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
       	for (var i = 0, cmd; cmd = commands[i]; i++) {
         	if(cmd.label) {
         	alert(cmd.handler)
         	$("#"+cmd.label).bind("mousedown", cmd.handler);
         	}
        }
       	//this.connect("mousedown", this.onmousedown);
        //this.connect("dblclick", this.ondblclick);
        //this.connect("mouseover", this.onmouseover);
        //this.connect("contextmenu", this.contextmenu);
        //this.connect("mouseout", this.onmouseout);
        //this.connect("mousedown", this.onmousedown);
        //this.connect("mouseup", this.onmouseup);
        this.connect("mousemove", this.onmousemove);
    }

    this.onmousemove =function(e){

       // $(e.target).attr("id")

    }



}

