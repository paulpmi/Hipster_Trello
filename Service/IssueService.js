"use strict";

class IssueService{

    constructor(issueRepository, userService, sprintService, commentService, statusRepository){
        this.placement = 0;
        this.issueRepository = issueRepository;
        this.userService = userService;
        this.sprintService = sprintService;
        this.statusRepository = statusRepository;
        this.commentService = commentService;
    }

    addIssueWithSubTasks(issueType, issueName, issueSprintId, issueCreatorId, issueAssigneeId, issueDescription,
             issueStatusId, issueTaskIds, issueCommentIds, issueUpdate, issueCreated){
        if (typeof issueType == "string" && typeof issueName == "string" && typeof issueDescription == "string"){

            let tasks = [];
            let comments = [];

            if (typeof this.sprintService.getSprint(issueSprintId) === "undefined")
                return "No Sprint exists with id: " + issueSprintId;
            if ( typeof this.userService.getUser(issueCreatorId) === "undefined")
                return "No such creator: " + issueSprintId;
            if (typeof this.userService.getUser(issueAssigneeId) === "undefined")
                return "No such assignee: " + issueAssigneeId;

            if (issueTaskIds.length != 0) {
                if (issueType === "task") {
                    for (let i = 0; i < issueTaskIds.length; i++) {
                        let issue = this.issueRepository.get(issueTaskIds[i]);
                        if (typeof issue === "undefined")
                            return "No Such subtask: " + issueTaskIds[i];
                        else if (issue.type === "task")
                            return "Tasks cannot have other tasks: " + issueTaskIds[i];
                        tasks.push(issue);
                    }
                }
                else {
                    for (let i = 0; i < issueTaskIds.length; i++) {
                        let issue = this.issueRepository.get(issueTaskIds[i]);
                        if (typeof issue === "undefined")
                            return "No Such subtask: " + issueTaskIds[i];
                        else if (issue.type !== "task")
                            return "Tasks cannot have other THAN tasks: " + issueTaskIds[i];
                        tasks.push(issue);
                    }
                }
            }

            for(let i = 0; i < issueCommentIds.length; i++) {
                let comment = this.commentService.getComment(issueCommentIds[i]);
                if (typeof comment === "undefined")
                    return "No Such comment: " + issueCommentIds[i];
                comments.push(comment);
            }

            let issueFile = require('../Entitites/Issue');
            let issue = new issueFile.Issue(this.placement, issueType, issueName, this.sprintService.getSprint(issueSprintId),
                this.userService.getUser(issueCreatorId), this.userService.getUser(issueAssigneeId),
            issueDescription, this.statusRepository.get(issueStatusId), tasks, comments, issueUpdate, issueCreated);
            this.issueRepository.add(issue);
            this.placement++;
            return "IssueService: Success";
        }
    }


    addIssueWithoutSubTasks(issueType, issueName, issueSprintId, issueCreatorId, issueAssigneeId, issueDescription,
                         issueStatusId, issueCommentIds, issueUpdate, issueCreated){
        if (typeof issueType == "string" && typeof issueName == "string" && typeof issueDescription == "string"){

            let comments = [];

            if (typeof this.sprintService.getSprint(issueSprintId) === "undefined")
                return "No Sprint exists with id: " + issueSprintId;
            if ( typeof this.userService.getUser(issueCreatorId) === "undefined")
                return "No such creator: " + issueSprintId;
            if (typeof this.userService.getUser(issueAssigneeId) === "undefined")
                return "No such assignee: " + issueAssigneeId;

            for(let i = 0; i < issueCommentIds.length; i++) {
                let comment = this.commentService.getComment(issueCommentIds[i]);
                if (typeof comment === "undefined")
                    return "No Such comment: " + issueCommentIds[i];
                comments.push(comment);
            }

            let issueFile = require('../Entitites/Issue');
            let issue = new issueFile.Issue(this.placement, issueType, issueName, this.sprintService.getSprint(issueSprintId),
                this.userService.getUser(issueCreatorId), this.userService.getUser(issueAssigneeId),
                issueDescription, this.statusRepository.get(issueStatusId), [], comments, issueUpdate, issueCreated);
            this.issueRepository.add(issue);
            this.placement++;
            return "IssueService: Success";
        }
    }

    getIssue(position){
        return this.issueRepository.get(position);
    }
}

module.exports.IssueService = IssueService;