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
    commnetService.addComment("Great2");
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


let status = require('../Entitites/Status');
let statusRepoFile = require('../Repositories/StatusRepository');
let statusRepository = new statusRepoFile.StatusRepository();
statusRepository.add(new status.Status(0, "New"));
statusRepository.add(new status.Status(1,"In Progress"));
statusRepository.add(new status.Status(2,"Feedback"));
statusRepository.add(new status.Status(3,"Rework"));
statusRepository.add(new status.Status(4,"Resolved"));

let issueRepoFile = require('../Repositories/IssueRepository');
let issueServiceFile = require('../Service/IssueService');
let issueService = new issueServiceFile.IssueService(new issueRepoFile.IssueRepository(), userService, sprintService, commnetService, statusRepository);

function addIssue() {
    console.log(issueService.addIssueWithoutSubTasks("task", "BaseIssue01", 0, 0, 0, "Description01", 1, [0, 1], "28/02/2018", "28/02/2018"));
    console.log(issueService.addIssueWithSubTasks("bug", "Issue01", 0, 0, 0, "Description01", 1, [0], [0, 1], "28/02/2018", "28/02/2018"));
}

function readIssue() {
    return issueService.getIssue(0).toString();
}

function updateIssue() {
    console.log(
        issueService.updateIssue(0, "feature", "UpdatedBaseIssue01", 0, 0, 0, "UpdatedDescription01", 0, [], [0], "29/02/2018", "29/02/2018")
    );
}

module.exports.addIssue = addIssue;
module.exports.readIssue = readIssue;
module.exports.updateIssue = updateIssue;