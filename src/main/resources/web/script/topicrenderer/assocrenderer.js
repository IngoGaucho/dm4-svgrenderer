

function AssocRenderer(assoc, ct1, ct2){

        var element = document.createElementNS("http://www.w3.org/2000/svg","svg")


    this.render = function (parentID){
    //function render(parentID){
    generate_svg()
    //$(my.remove()
    $(parentID).append(element)
    }

       generate_svg = function() {
         //function generate_svg() {
             group = document.createElementNS("http://www.w3.org/2000/svg", "g")
             group.setAttribute("id",assoc.id+"group")
             var assocline = document.createElementNS("http://www.w3.org/2000/svg", "path");
            assocline.setAttribute("id", ct1.id+" und "+ct2.id)
            //assocline.setAttribute("d", "M "+"200"+" "+"200"+" l "+"300"+" "+"300");
             assocline.setAttribute("d", "M "+ct1.x+" "+ct1.y+" l "+(ct2.x-ct1.x)+" "+(ct2.y-ct1.y));
             assocline.setAttribute("stroke", "red");
             assocline.setAttribute("stroke-width", "3");
             assocline.setAttribute("fill", "none");
             group.appendChild(assocline)
             element.appendChild(group)

             function build_topic(topic){
                return new Topic(topic)
             }
        }



}