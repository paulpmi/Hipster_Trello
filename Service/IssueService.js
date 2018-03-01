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

            if (issueTaskIds.length !== 0) {
                if (issueType !== "task") {
                    tasks = this.getTasks(issueTaskIds);
                }
                else {
                    return "Only Features and Bugs can have subtasks"
                }
            }

            if (issueCommentIds.length !== 0)
                comments = this.getComments(issueCommentIds);

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

            console.log("SPRINT: ", this.sprintService.getSprint(issueSprintId));

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

    getComments(issueCommentIds) {
        let comments = [];
        for(let i = 0; i < issueCommentIds.length; i++) {
            let comment = this.commentService.getComment(issueCommentIds[i]);
            if (typeof comment === "undefined")
                return "No Such comment: " + issueCommentIds[i];
            comments.push(comment);
        }
        return comments;
    }

    getTasks(issueTaskIds){
        let tasks = [];
        for (let i = 0; i < issueTaskIds.length; i++) {
            let issue = this.issueRepository.get(issueTaskIds[i]);
            if (typeof issue === "undefined")
                return "No Such subtask: " + issueTaskIds[i];
            else if (issue.type === "task")
                return "Tasks cannot have other tasks: " + issueTaskIds[i];
            tasks.push(issue);
        }
        return tasks;
    }

    updateIssue(id, type, name, sprint, createdBy, assignee, description, status, tasks, comments, updatedAt, createdAt){
        let issue = this.issueRepository.get(id);

        if (type !== issue.type)
            issue.type = type;
        if (name !== issue.name)
            issue.name = name;
        if (this.sprintService.getSprint(sprint) !== issue.sprint) {
            issue.sprint = this.sprintService.getSprint(sprint);
            for (let i = 0; i < issue.tasks.length; i++) {
                issue.tasks[i].sprint = this.sprintService.getSprint(sprint);
                this.issueRepository.update(issue.tasks[i].id, issue.tasks[i]);
            }
        }
        if (this.userService.getUser(createdBy) !== issue.creator)
            issue.creator = this.userService.getUser(createdBy);
        if (this.userService.getUser(assignee) !== issue.assignee)
            issue.assignee = this.userService.getUser(assignee);
        if (description !== issue.description)
            issue.description = description;

        if (this.statusRepository.get(status) !== issue.status) {
            if (this.statusRepository.get(status) === "Resolved") {
                let parents = this.findParents(issue);
                for (let i = 0; i < parents.length; i++)
                    if (this.checkParentIsCompleted(parents[i])) {
                        parents[i].status = "Ready For Testing";
                        this.issueRepository.update(parents[i].id, parents[i]);
                    }
                issue.status = this.statusRepository.get(status);
            }
            else {
                issue.status = this.statusRepository.get(status);
            }
        }

        let actualTasks = this.getTasks(tasks);
        if (actualTasks !== issue.tasks)
            issue.tasks = actualTasks;

        let actualComments = this.getComments(comments);
        if (actualComments !== issue.comments)
            issue.comments = actualComments;

        if (updatedAt !== issue.updatedAt)
            issue.updatedAt = updatedAt;
        if (createdAt !== issue.createdAt)
            issue.createdAt = createdAt;

        this.issueRepository.update(issue.id, issue);
    }


    checkParentIsCompleted(issue){
        for (let i = 0; i < issue.tasks.length; i++)
            if (issue.tasks[i] !== "Resolved" && issue.tasks[i] !== "Ready For Testing")
                return false;
        return true;
    }

    updateParent(issue){
        let parents = this.findParents(issue);
        for (let i = 0; i < parents.length; i++) {
            parents[i].status = issue.status;
            this.issueRepository.update(parents[i].id, parents[i]);
        }
    }

    findParents(issue){
        let result = [];
        let repo = this.issueRepository.getAll();
        for (let i = 0; i < repo.length; i++)
            if (repo[i].tasks.includes(issue))
                result.push(repo[i]);
        return result;
    }

    getIssuesBySprint(sprint){
        let result = [];
        let repo = this.issueRepository.getAll();
        for(let i = 0; i < repo.length; i++)
            if (repo[i].sprint === sprint)
                result.push(repo[i]);
        return result;
    }

    getIssuesByStatus(status){
        let result = [];
        let repo = this.issueRepository.getAll();
        for(let i = 0; i < repo.length; i++)
            if (repo[i].status === status)
                result.push(repo[i]);
        return result;
    }
}

module.exports.IssueService = IssueService;