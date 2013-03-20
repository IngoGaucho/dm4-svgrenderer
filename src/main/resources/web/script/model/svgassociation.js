function SvgAssociation(id, type_uri, topic_id_1, topic_id_2, x1, y1 ,x2, y2, glob_x, glob_y) {

        var self = this
        this.id = id
        this.type_uri = type_uri
        this.topic_id_1 = topic_id_1
        this.topic_id_2 = topic_id_2
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.parent
        this.glob_x = glob_x
        this.glob_y = glob_y



        var element = document.createElementNS("http://www.w3.org/2000/svg","svg")
        element.setAttribute('id',this.id)

        this.hide = function() {
            this.remove()
            reset_selection()
        }

        /**
         * @param   assoc   an Association object
         */
        this.update = function(assoc) {

        }

        this.remove = function() {
            $("#"+this.id).empty()
            $("#"+this.id).remove()
        }

        this.move_to = function(x, y) {
                    this.glob_x = x
                    this.glob_y = y
                    $("#"+id+"assocgroup").attr("transform","translate("
                                     +this.glob_x+
                                     ","
                                     +this.glob_y+
                                     ")")
                }
        // ---

        function reset_selection() {
            if (!self.is_topic_selected && self.selected_object_id == id) {
                self.selected_object_id = -1
            }
        }



            this.render = function (){
                if (type_uri) color = dm4c.get_type_color(type_uri)
                if (!color) color = "red"
                group = document.createElementNS("http://www.w3.org/2000/svg", "g")
                group.setAttribute("id",this.id+"assocgroup")
                group.setAttribute("transform","translate("
                                   +(this.glob_x+this.x1)+
                                   ","
                                   +(this.glob_y+this.y1)+
                                   ") rotate("
                                   +Math.atan((self.y2-self.y1)/(self.x2-self.x1))*180/Math.PI+
                                   ", 0, 0)"
                                   )
                var assocline = document.createElementNS("http://www.w3.org/2000/svg", "path");
                assocline.setAttribute("id", topic_id_1+" und "+topic_id_2)
                assocline.setAttribute("d", "M0,0 L100,0")
                assocline.setAttribute("stroke", color);
                assocline.setAttribute("stroke-width", "6");
                assocline.setAttribute("fill", "none");
                group.appendChild(assocline)
                element.appendChild(group)
                $(this.parent).prepend(element)
                this.connectAll()
            }

            this.is_player_topic = function(topic_id) {
                        return this.topic_id_1 == topic_id || this.topic_id_2 == topic_id
                    }

            this.get_topic_1 = function() {
                        return this.topic_id_1
                    }

                    this.get_topic_2 = function() {
                        return this.topic_id_2
                    }



             this.setParent = function(dom){
                   this.parent = dom
                }




                this.connect = function(event, listener) {
                	if (listener != null) {
                   	    element.addEventListener(event, listener);
                	}
                }

        this.connectAll = function() {
           	this.connect("mousedown", this.mousedown);
           	this.connect("mousemove", this.mousemove);
           	this.connect("contextmenu", this.contextmenu);
       	}

        //Vars for kinetics
        var drag = false
        var prevx = 0
        var prevy = 0
        var dx = 0
        var dy = 0

        function dragON(){
            drag == true
        }

        this.mousedown = function(e){
            dm4c.do_select_association(id)
            if (e.button == 0) dragON()
        }

        this.onmousemove = function(e) {
            alert(drag)
            if(drag){
               dm4c.fire_event("post_move_cluster", cluster)

            }
        }


        this.contextmenu = function(e) {
                    e.preventDefault()

                    if($("#contextmenu").length==1) $("#contextmenu").remove()
                    var commands = dm4c.get_association_commands(dm4c.selected_object, "context-menu")

                    var menu = new ringmenu(e.offsetX, e.offsetY, self.parent, commands)
                    menu.render()
                }




    }