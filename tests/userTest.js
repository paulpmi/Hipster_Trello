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


//let sprintServiceFile = require('../Service/SprintService');
//let sprintService = new sprintServiceFile.SprintService(new sprintRepoFile.SprintRepository());


module.exports.addSprint = addSprint;
module.exports.readSprint = readSprint;

//let issueRepoFile = require('../Repositories/IssueRepository');
//let issueServiceFile = require('../Service/IssueService');
//let issueService = new issueServiceFile.IssueService(new issueRepoFile.IssueRepository(), userService, sprintService, commnetService, statusRepository);


let status = require('../Entitites/Status');
let statusRepoFile = require('../Repositories/StatusRepository');
let statusRepository = new statusRepoFile.StatusRepository();
statusRepository.add(new status.Status(0, "New"));
statusRepository.add(new status.Status(1,"In Progress"));
statusRepository.add(new status.Status(2,"Feedback"));
statusRepository.add(new status.Status(3,"Rework"));
statusRepository.add(new status.Status(4,"Resolved"));
statusRepository.add(new status.Status(5,"Ready For Testing"));

let sprintRepoFile = require('../Repositories/SprintRepository');
let issueRepoFile = require('../Repositories/IssueRepository');
let compoundServiceFile = require('../Service/CompoundService');

let compountService = new compoundServiceFile.CompundService(new issueRepoFile.IssueRepository(),
    userService, new sprintRepoFile.SprintRepository(), commnetService, statusRepository);


function addIssue() {
    console.log(compountService.addIssueWithoutSubTasks("task", "BaseIssue01", "Sprint 1", 0, 0, "Description01", 0, [0, 1], "28/02/2018", "28/02/2018"));
    console.log(compountService.addIssueWithSubTasks("bug", "Issue01", "Sprint 1", 0, 0, "Description01", 0, [0], [0, 1], "28/02/2018", "28/02/2018"));
}

function readIssue() {
    //return issueService.getIssue(0).toString() + "\n" + issueService.getIssue(1).toString();
    return "Power\n" + compountService.issueRepository.getAll();
}

function updateIssue() {
    console.log(
        compountService.updateIssue(1, "feature", "UpdatedBaseIssue01", "Sprint 2", 0, 0, "UpdatedDescription01", 4, [0], [0], "29/02/2018", "29/02/2018")
    );
}

function filterBySprint() {
    return compountService.getIssuesBySprint(1);
}

function filterByStatus() {
    console.log("Filter by Status: " + statusRepository.get(0).name + " " +
        compountService.getIssuesByStatus(0)
    );
}

function addSprint(name) {
    compountService.addSprint(name);
}

function readSprint(position) {
    return compountService.getSprint(position);
}

function testSprint() {
}


module.exports.addIssue = addIssue;
module.exports.readIssue = readIssue;
module.exports.updateIssue = updateIssue;
module.exports.filterBySprint = filterBySprint;
module.exports.filterByStatus = filterByStatus;


let projectRepoFile = require('../Repositories/ProjectRepository');
let projectServiceFile = require('../Service/ProjectService');
let projectService = new projectServiceFile.ProjectService(new projectRepoFile.ProjectRepository(), compountService);

function addProject(sprints) {
    return projectService.addProject(sprints);
}

function readProject(position) {
    console.log("READ: " + projectService.getProject(position));
    return projectService.getProject(position);
}

module.exports.addProject = addProject;
module.exports.readProject = readProject;


