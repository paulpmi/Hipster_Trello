"use strict";

class Project{
    constructor(id, sprints){
        this.id = id;
        this.sprints = sprints;
        this.name = "FIRST PROJECT";
    }
}

Project.prototype.toString = function () {
    let str = this.name;
    for (let  i = 0; i< this.sprints.length; i++) {
        str += this.sprints[i].name;
        str += "</br>";
    }
    return str;
};

module.exports.Project = Project;