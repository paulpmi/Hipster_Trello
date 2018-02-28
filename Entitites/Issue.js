"use strict";

class Issue{
    constructor(id, type, name, sprint, createdBy, assignee, description, status, tasks, comments, updatedAt, createdAt){
        this.id = id;
        this.type = type;
        this.name = name;
        this.sprint = sprint;
        this.creator = createdBy;
        this.assignee = assignee;
        this.description = description;
        this.status = status;
        this.tasks = tasks;
        this.comments = comments;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
}

Issue.prototype.toString = function () {
    let str = "\n";
    str += "Type: " + this.type + "\n";
    str += "Name: " + this.name + "\n";
    str += "Sprint: " + this.sprint.name + "\n";
    str += "Creator: " + this.creator.name + "\n";
    str += "Assignee: " + this.assignee.name + "\n";
    str += "Description: " + this.description + "\n";
    str += "Status: " + this.status.name + "\n";

    str += "Tasks:\n";
    for (let  i = 0; i< this.tasks.length; i++)
        str += "Task: " + this.tasks[i].name + "\n";

    str += "Comments:\n";
    for (let i = 0; i< this.comments.length; i++)
        str += "Comment: " + this.comments[i].name + "\n";

    str += "Update: " + this.updatedAt + "\n";
    str += "Create: " + this.createdAt + "\n";
    return str;
};

module.exports.Issue = Issue;