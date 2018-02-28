"use strict";

class Project{
    constructor(id, sprints){
        this.id = id;
        this.sprints = sprints;
    }
}

Project.prototype.toString = function () {
    let str = "";
    for (let  i = 0; i< this.sprints.length; i++) {
        str += this.sprints[i].name;
        str += "\n";
    }
    return str;
};

module.exports.Project = Project;