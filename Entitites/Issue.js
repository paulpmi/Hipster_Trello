"use strict";

class Issue{
    constructor(id, type, name, sprint, createdBy, assignee, description, status, tasks, comments, updatedAt, createdAt){
        this.id = id;
        this.type = type;
        this.name = name;
        this.sprint = sprint;
        this.createdBy = createdBy;
        this.assignee = assignee;
        this.description = description;
        this.status = status;
        this.tasks = tasks;
        this.comments = comments;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
}

module.exports.Issue = Issue;