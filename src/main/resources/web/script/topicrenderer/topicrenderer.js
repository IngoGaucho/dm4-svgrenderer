function TopicRenderer(topic){
    width = 30
    height = 30
    element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    element.setAttribute("id",topic.id)
    //create new element






    this.render = function (parentID){
    //function render(parentID){
    generate_svg()
    $(parentID).append(element)
    }

       generate_svg = function() {
         //function generate_svg() {
             var ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
             ball.setAttribute("cx", topic.x);
             ball.setAttribute("cy", topic.y);
             ball.setAttribute("r", "20");
             ball.setAttribute("fill", "#336699");
             element.appendChild(ball)
             var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
             text.setAttribute("x",topic.x)
             text.setAttribute("y", topic.y-30);
             text.setAttribute("fill", "red");
             text.appendChild(document.createTextNode(topic.label))
             element.appendChild(text)
        }



}