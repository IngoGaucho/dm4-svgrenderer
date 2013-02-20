

function TopicRenderer(topic){
    //Vars for kinetics
    var dragON = false
    var prevx = 0
    var prevy = 0
    var dx = 0
    var dy = 0
          var TrueCoords = null;
     var SVGDocument
     var SVGRoot


    var topicx = topic.x
    var topicy = topic.y

    var element = document.createElementNS("http://www.w3.org/2000/svg","svg")
    var myID = "#"+topic.id
    //this.self = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    element.setAttribute("id",topic.id)
    //create new element

    // events
     this.connect = function(event, listener) {
     		if (listener != null) {
     	    element.addEventListener(event, listener);


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
        $("#"+topic.id+"text").text('dragstart')
        dragON = true
        prevx = e.x
        prevy = e.y
        }


           this.onmousemove = function(e) {
                if (dragON) {
                     topicx = topicx+(e.x-prevx)
                     topicy = topicy+(e.y-prevy)
                                      prevx = e.x
                                      prevy = e.y
                    $("#"+topic.id+"text").text(topicx+" "+topicy)
                    $("#"+topic.id+"group").attr("transform","translate("
                        +topicx+
                        ","
                        +topicy+
                        ")"
                       )


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
              $("#"+topic.id+"text").text('dragstop')
              dragON = false
              topic.x = topicx
              topic.y = topicy
               dm4c.fire_event("post_move_topic", topic)


        }




    this.render = function (parentID){
    //function render(parentID){
    generate_svg()
    //$(my.remove()
    $(parentID).append(element)
    		this.connectAll();
    }

       generate_svg = function() {
         //function generate_svg() {
             group = document.createElementNS("http://www.w3.org/2000/svg", "g")
             group.setAttribute("id",topic.id+"group")
             group.setAttribute("transform","translate("+topic.x+","+topic.y+")")

             //

             //

             var ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
             ball.setAttribute("id",topic.id+"ball")
             ball.setAttribute("cx", 0);
             ball.setAttribute("cy", 0);
             ball.setAttribute("r", "20");
             ball.setAttribute("fill", "#336699");
             group.appendChild(ball)
             var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
             text.setAttribute("id",topic.id+"text")
             text.setAttribute("x",0)
             text.setAttribute("y", 30);
             text.setAttribute("fill", "red");
             text.appendChild(document.createTextNode(topic.label))
             group.appendChild(text)
             element.appendChild(group)
        }



}