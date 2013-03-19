function ringmenu(x, y, parent, commands) {

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
        var beta = 2*Math.PI/commands.length

        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
        group.appendChild(defs)

        for (var i = 0, cmd; cmd = commands[i]; i++) {
            if(cmd.label){
                var alpha = i*beta
                elements[cmd.label] = new menu_item(alpha, beta, cmd.label, group, defs)
                elements[cmd.label].render_item()
            }
        }

        //group.appendChild(render_item())

        $(this.parent).append(domelement)
        this.connectAll()


    }

    //menue items modell

    function menu_item(alpha, beta, name, group, defs){

        this.name = name

        this.click = function(){
        }

        this.render_item = function (){
                var piecentext = document.createElementNS("http://www.w3.org/2000/svg", "g")
                var piece = document.createElementNS("http://www.w3.org/2000/svg", "path");
                piecentext.setAttribute("id",name)
                piece.setAttribute("d",
                    "M "+Math.cos(alpha+0.2)*30+", "+(-1)*Math.sin(alpha+0.2)*30+ //start lower inner circle
                    " A"+30+","+30+    //radius 30 degrees
                        " "+0+         //non-fancy flag
                        " "+0+","+0+  //short-arc, counterclockwise
                        " "+Math.cos(alpha+beta-0.2)*30+","+(-1)*Math.sin(alpha+beta-0.2)*30+ //arc target
                    " L"+Math.cos(alpha+beta-0.2)*80+","+(-1)*Math.sin(alpha+beta-0.2)*80+  //go to upper circle
                    " A"+80+","+80+    //radius 50 degrees
                        " "+0+         //non-fancy flag
                        " "+0+","+1+  //short-arc, counterclockwise
                        " "+Math.cos(alpha+0.2)*80+","+(-1)*Math.sin(alpha+0.2)*80+ //arc target
                     " z" //close
                )
                piece.setAttribute("stroke", "black");
                piece.setAttribute("stroke-width", "1");
                piece.setAttribute("style", "fill:blue");

                var textcurve = document.createElementNS("http://www.w3.org/2000/svg", "path")
                textcurve.setAttribute("id","def_"+name)
                textcurve.setAttribute("d",
                                        "M "+Math.cos(alpha)*50+", "+(-1)*Math.sin(alpha)*50+ //start lower inner circle
                                        " A"+50+","+50+    //radius 30 degrees
                                            " "+0+         //non-fancy flag
                                            " "+0+","+0+  //short-arc, counterclockwise
                                            " "+Math.cos(alpha+beta)*50+","+(-1)*Math.sin(alpha+beta)*50 //arc target
                                        )
                defs.appendChild(textcurve);

                var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
                text.setAttribute("fill", "red");
                text.setAttribute("id",name)
                var textpath = document.createElementNS("http://www.w3.org/2000/svg", "textPath")
                //textpath.setAttribute("xlink:href", name);
                textpath.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#def_"+name);
                textpath.appendChild(document.createTextNode(name))
                text.appendChild(textpath)
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
         	if(cmd.label) $("#"+cmd.label).bind("mousedown", cmd.handler);
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

