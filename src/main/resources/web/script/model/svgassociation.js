function SvgAssociation(id, type_uri, topic_id_1, topic_id_2, x1, y1 ,x2, y2) {

        this.id = id
        this.type_uri = type_uri
        this.topic_id_1 = topic_id_1
        this.topic_id_2 = topic_id_2
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
         this.y2 = y2



        var element = document.createElementNS("http://www.w3.org/2000/svg","svg")
        element.setAttribute('id',this.id)

        this.hide = function() {
            delete assocs[id]
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

        // ---

        function reset_selection() {
            if (!self.is_topic_selected && self.selected_object_id == id) {
                self.selected_object_id = -1
            }
        }



            this.render = function (parentID){

                        group = document.createElementNS("http://www.w3.org/2000/svg", "g")
                        group.setAttribute("id",this.id+"assocgroup")
                        var assocline = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        assocline.setAttribute("id", topic_id_1+" und "+topic_id_1)
                        //assocline.setAttribute("d", "M "+"200"+" "+"200"+" l "+"300"+" "+"300");
                        assocline.setAttribute("d", "M "+this.x1+" "+this.y1+" l "+(this.x2-this.x1)+" "+(this.y2-this.y1))


                        assocline.setAttribute("stroke", "red");
                        assocline.setAttribute("stroke-width", "3");
                        assocline.setAttribute("fill", "none");
                        group.appendChild(assocline)
                        element.appendChild(group)

            $(parentID).append(element)
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

            function build_topic(topic){
                 return new Topic(topic)
                 }




    }