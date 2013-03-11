function ringmenu(x, y, parent) {

//how to svg: arc, coords von kreis fkt
    this.x = x
    this.y = y
    this.parent = parent

    var domelement = document.createElementNS("http://www.w3.org/2000/svg","svg")
    domelement.setAttribute("id",this.id)

     this.remove = function() {
       alert("#"+this.id)
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

        var ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ball.setAttribute("id",this.id+"ball")
        ball.setAttribute("cx", 0);
        ball.setAttribute("cy", 0);
        ball.setAttribute("r", "40");
        ball.setAttribute("fill","black");
    }

}
