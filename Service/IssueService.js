"use strict";

class IssueService{

    constructor(userRepository, sprintRepository, statusRepository, commentRepository){
        this.placement = 0;
        let issueFile = require('../Repositories/IssueRepository');
        this.issueRepository = new issueFile.IssueRepository();
        this.userRepository = userRepository;
        this.sprintRepository = sprintRepository;
        this.statusRepository = statusRepository;
        this.commentRepository = commentRepository;
    }

    addIssue(issueType, issueName, issueSprint, issueCreator, issueAssignee, issueDescription, issueStatus, issueTasks, issueComments, issueUpdate, issueCreated){
        if (typeof issueType == "string" && typeof issueName == "string" && typeof issueDescription == "string"){
            //let user = require('../Entitites/User');
            //let u = new user.User(this.placement, userName);
            //this.issueRepository.addIssue(u);
        }
    }

    getUser(position){
        return this.userRepository.getUser(position);
    }
}

module.exports.IssueService = IssueService;