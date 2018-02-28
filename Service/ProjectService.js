/**
 * Created by paulp on 2/28/2018.
 */

"use strict";

class ProjectService{

    constructor(projectRepository, sprintService){
        this.placement = 0;
        this.projectRepository = projectRepository;
        this.sprintService = sprintService;
    }

    addProject(sprintIds){
        if (!Array.isArray(sprintIds))
            return "Not a valid list of Ids";
        console.log(this.sprintService.getAll());

        let sprints = [];
        for (let i = 0; i < sprintIds.length; i++) {
            let sprint = this.sprintService.getAll().filter((sprint) => {
                return sprint.id === sprintIds[i]
            });
            if (typeof sprint === "undefined")
                return "ID does not exists: " + sprintIds[i];
            else
                sprints.push(sprint);
        }

        let project = require('../Entitites/Project');
        let p = new project.Project(this.placement, sprints);

        this.projectRepository.add(this.placement, p);
        this.placement++;
    }

    getProject(position){
        return this.projectRepository.get(position);
    }
}

module.exports.ProjectService = ProjectService;