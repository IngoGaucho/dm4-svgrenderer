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
                var length = Math.sqrt(Math.pow(self.y2-self.y1,2)+Math.pow(self.x2-self.x1,2))
                var angle = Math.atan((self.y2-self.y1)/(self.x2-self.x1))*180/Math.PI
                if (this.x1>this.x2) angle = 180+angle
                if (type_uri) color = dm4c.get_type_color(type_uri)
                if (!color) color = "grey"
                group = document.createElementNS("http://www.w3.org/2000/svg", "g")
                group.setAttribute("id",this.id+"assocgroup")
                group.setAttribute("transform","translate("
                                   +(this.glob_x+this.x1)+
                                   ","
                                   +(this.glob_y+this.y1)+
                                   ") rotate("
                                   +angle+
                                   ", 0, 0)"
                                   )
                var assocline = document.createElementNS("http://www.w3.org/2000/svg", "path");
                assocline.setAttribute("id", topic_id_1+" und "+topic_id_2)
                assocline.setAttribute("d", "M0,0 L"+length+",0")
                assocline.setAttribute("stroke", color);
                assocline.setAttribute("stroke-width", "6");
                assocline.setAttribute("fill", "none");

                // An invisible rect to have something to touch
                var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x","0")
                rect.setAttribute("y","-25")
                rect.setAttribute("width",length)
                rect.setAttribute("height",50)
                rect.setAttribute("fill", "none");
                rect.setAttribute("stroke", "none");

                group.appendChild(assocline)
                group.appendChild(rect)
                element.appendChild(group)
                $(this.parent).prepend(element)
                this.connectAll()
            }


        this.get_other_topic = function(topic_id) {
            if (this.get_topic_1() == topic_id) {
                return this.get_topic_2()
            } else if (this.get_topic_2() == topic_id) {
                return this.get_topic_1()
            } else {
                throw "CanvasAssocError: topic " + topic_id + " is not a player in " + JSON.stringify(this)
            }
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
           	this.connect("mousemove", this.onmousemove);
            this.connect("mouseup", this.onmouseup);
            this.connect("mouseout", this.onmouseout);
           	this.connect("contextmenu", this.contextmenu);
       	}

        //Vars for kinetics
        var drag = false
        var prevx = 0
        var prevy = 0
        var dx = 0
        var dy = 0

        function dragON(){
            drag = true
        }

        this.mousedown = function(e){
            dm4c.do_select_association(id)
            if (e.button == 0) dragON()
            prevx = e.x
            prevy = e.y
        }

        this.onmouseup = function(e) {
            drag = false
        }

        this.onmouseout = function(e) {
            drag = false
        }

        this.onmousemove = function(e) {
            if(drag){
                var dragdata = {"assoc":self,"dx":(e.x-prevx),"dy":(e.y-prevy)}
                dm4c.fire_event("post_move_cluster", dragdata)
                prevx = e.x
                prevy = e.y

            }
        }


        this.contextmenu = function(e) {
                    e.preventDefault()

                    if($("#contextmenu").length==1) $("#contextmenu").remove()
                    var commands = dm4c.get_association_commands(dm4c.selected_object, "context-menu")

                    var menu = new blockmenu(e.offsetX, e.offsetY, self.parent, commands)
                    menu.render()
                }




    }