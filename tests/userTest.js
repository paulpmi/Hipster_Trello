"use strict";

let userRepoFile = require('../Repositories/UserRepository');
let userServiceFile = require('../Service/UserService');
let userService = new userServiceFile.UserService(new userRepoFile.UserRepository());

function addUser(){
    console.log("Started");
    userService.addUser("Paul");
    console.log("Sent To Service");
}

function readUser(position){
    console.log(userService.getUser(position));
    return userService.getUser(position);
}

module.exports.addUser = addUser;
module.exports.readUser = readUser;


let commentRepoFile = require('../Repositories/CommentsRepository');
let commentServiceFile = require('../Service/CommentsService');
let commnetService = new commentServiceFile.CommnetsService(new commentRepoFile.CommentsRepository());

function addComment() {
    commnetService.addComment("Great");
}

function readCommnet(position) {
    return commnetService.getComment(position);
}

module.exports.addCommnet = addComment;
module.exports.readComment = readCommnet;

let sprintRepoFile = require('../Repositories/SprintRepository');
let sprintServiceFile = require('../Service/SprintService');
let sprintService = new sprintServiceFile.SprintService(new sprintRepoFile.SprintRepository());

function addSprint() {
    sprintService.addSprint("Sprint 1");
}

function readSprint(position) {
    return sprintService.getSprint(position);
}

module.exports.addSprint = addSprint;
module.exports.readSprint = readSprint;


let projectRepoFile = require('../Repositories/ProjectRepository');
let projectServiceFile = require('../Service/ProjectService');
let projectService = new projectServiceFile.ProjectService(new projectRepoFile.ProjectRepository(), sprintService);

function addProject(sprints) {
    return projectService.addProject(sprints);
}

function readProject(position) {
    console.log("READ: " + projectService.getProject(position));
    return projectService.getProject(position);
}

module.exports.addProject = addProject;
module.exports.readProject = readProject;
