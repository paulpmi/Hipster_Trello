/**
 * Created by paulp on 2/28/2018.
 */
/**
 * Created by paulp on 2/28/2018.
 */

"use strict";

class SprintService{

    constructor(sprintRepository){
        this.placementIssue = 0;
        this.sprintRepository = sprintRepository;
    }

    addSprint(sprintName){
        if (typeof sprintName == "string"){
            let sprint = require('../Entitites/Sprint');
            let s = new sprint.Sprint(this.placementIssue, sprintName);
            this.sprintRepository.add(s);
            this.placementIssue++;
            return this.placementIssue-1;
        }
        else
            return "SprintName is not a string";
    }

    getSprint(position){
        return this.sprintRepository.get(position);
    }

    getAll(){
        return this.sprintRepository.getAll();
    }
}

module.exports.SprintService = SprintService;