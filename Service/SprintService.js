/**
 * Created by paulp on 2/28/2018.
 */
/**
 * Created by paulp on 2/28/2018.
 */

"use strict";

class SprintService{

    constructor(sprintRepository){
        this.placement = 0;
        //this.userRepository = require('../Repositories/UserRepository');
        //this.userRepository = new this.userRepository.UserRepository();
        this.sprintRepository = sprintRepository;
    }

    addSprint(sprintName){
        if (typeof sprintName == "string"){
            let sprint = require('../Entitites/Sprint');
            let s = new sprint.Sprint(this.placement, sprintName);
            this.sprintRepository.add(s);
            this.placement++;
        }
    }

    getSprint(position){
        return this.sprintRepository.get(position);
    }

    getAll(){
        return this.sprintRepository.getAll();
    }
}

module.exports.SprintService = SprintService;