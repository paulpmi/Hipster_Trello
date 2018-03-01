"use strict";

class CompoundService{

    constructor(issueRepository, userService, sprintRepository, commentService, statusRepository){
        this.placementIssue = 0;
        this.placementSprint = 0;
        this.issueRepository = issueRepository;
        this.userService = userService;
        this.sprintRepository = sprintRepository;
        this.statusRepository = statusRepository;
        this.commentService = commentService;
    }

    addSprint(sprintName){
        if (typeof sprintName === "string") {
            let sprint = require('../Entitites/Sprint');
            let s = new sprint.Sprint(this.placementSprint, sprintName);
            this.sprintRepository.add(s);
            this.placementSprint++;

            console.log("HERE: " + this.issueRepository.getAll().length);
            for (let i = 0; i < this.issueRepository.getAll().length; i++) {
                console.log("HERE: " + this.issueRepository.get(i).sprint + " vs " + sprintName);
                if (this.issueRepository.get(i).sprint === sprintName) {
                    console.log("GOT UNEXISTENT SPRINT");
                    this.issueRepository.get(i).sprint = s;
                    this.issueRepository.update(this.issueRepository.get(i).id, this.issueRepository.get(i));
                }
            }

            return this.placementSprint - 1;
        }
        else
            return "Sprint Name is not a string";
    }

    getSprint(position){
        return this.sprintRepository.get(position);
    }

    getAllSprints(){
        return this.sprintRepository.getAll();
    }

    addIssueWithSubTasks(issueType, issueName, issueSprintId, issueCreatorId, issueAssigneeId, issueDescription,
                         issueStatusId, issueTaskIds, issueCommentIds, issueUpdate, issueCreated){
        if (typeof issueType == "string" && typeof issueName == "string" && typeof issueDescription == "string"){

            let tasks = [];
            let comments = [];

            if ( typeof this.userService.getUser(issueCreatorId) === "undefined")
                return "No such creator: " + issueSprintId;
            if (typeof this.userService.getUser(issueAssigneeId) === "undefined")
                return "No such assignee: " + issueAssigneeId;

            if (issueTaskIds.length !== 0) {
                if (issueType !== "task") {
                    tasks = this.getTasks(issueTaskIds);
                    if (!Array.isArray(tasks)) {
                        console.log("ERROR IN TASKS: " + tasks);
                        return tasks;
                    }
                }
                else {
                    return "Only Features and Bugs can have subtasks";
                }
            }

            if (issueCommentIds.length !== 0)
                comments = this.getComments(issueCommentIds);

            let sprint = null;
            if (typeof this.sprintRepository.get(issueSprintId) === "undefined")
                sprint = issueSprintId;
            else
                sprint = this.sprintRepository.get(issueSprintId);

            let issueFile = require('../Entitites/Issue');
            let issue = new issueFile.Issue(this.placementIssue, issueType, issueName, sprint,
                this.userService.getUser(issueCreatorId), this.userService.getUser(issueAssigneeId),
                issueDescription, this.statusRepository.get(0), tasks, comments, issueUpdate, issueCreated);
            this.issueRepository.add(issue);
            this.placementIssue++;
            return "IssueService: Success";
        }
    }

    addIssueWithoutSubTasks(issueType, issueName, issueSprintName, issueCreatorId, issueAssigneeId, issueDescription,
                            issueStatusId, issueCommentIds, issueUpdate, issueCreated){
        if (typeof issueType == "string" && typeof issueName == "string" && typeof issueDescription == "string"){

            let comments = [];

            if ( typeof this.userService.getUser(issueCreatorId) === "undefined")
                return "No such creator: " + issueCreatorId;
            if (typeof this.userService.getUser(issueAssigneeId) === "undefined")
                return "No such assignee: " + issueAssigneeId;

            for(let i = 0; i < issueCommentIds.length; i++) {
                let comment = this.commentService.getComment(issueCommentIds[i]);
                if (typeof comment === "undefined")
                    return "No Such comment: " + issueCommentIds[i];
                comments.push(comment);
            }

            console.log("SPRINT: ", this.sprintRepository.getByValue(issueSprintName));

            let sprint = null;
            if (this.sprintRepository.getByValue(issueSprintName) === null)
                sprint = issueSprintName;
            else
                sprint = this.sprintRepository.getByValue(issueSprintName);

            let issueFile = require('../Entitites/Issue');
            let issue = new issueFile.Issue(this.placementIssue, issueType, issueName, sprint,
                this.userService.getUser(issueCreatorId), this.userService.getUser(issueAssigneeId),
                issueDescription, this.statusRepository.get(0), [], comments, issueUpdate, issueCreated);
            this.issueRepository.add(issue);
            this.placementIssue++;
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
            let issue = this.getIssue(issueTaskIds[i]);
            if (typeof issue === "undefined")
                return "No Such subtask: " + issueTaskIds[i];
            tasks.push(issue);
        }
        return tasks;
    }

    updateIssue(id, type, name, sprint, createdBy, assignee, description, status, tasks, comments, updatedAt, createdAt){
        let issue = this.getIssue(id);

        if (type !== issue.type)
            issue.type = type;
        if (name !== issue.name)
            issue.name = name;

        if (this.userService.getUser(createdBy) !== issue.creator)
            issue.creator = this.userService.getUser(createdBy);
        if (this.userService.getUser(assignee) !== issue.assignee)
            issue.assignee = this.userService.getUser(assignee);
        if (description !== issue.description)
            issue.description = description;

        if (this.statusRepository.get(status) !== issue.status) {
            if (this.statusRepository.get(status).name === "Resolved") {
                let parents = this.findParents(issue);
                for (let i = 0; i < parents.length; i++)
                    if (this.checkParentIsCompleted(parents[i])) {
                        parents[i].status = this.statusRepository.get(5);
                        this.issueRepository.update(parents[i].id, parents[i]);
                    }
                issue.status = this.statusRepository.get(status);
            }
            else {
                issue.status = this.statusRepository.get(status);
                this.updateParent(issue);
            }
        }

        let actualTasks = this.getTasks(tasks);
        if (actualTasks !== issue.tasks)
            issue.tasks = actualTasks;

        if (this.sprintRepository.getByValue(sprint) !== issue.sprint && this.sprintRepository.getByValue(sprint) !== null) {
            issue.sprint = this.sprintRepository.getByValue(sprint);
            for (let i = 0; i < issue.tasks.length; i++) {
                issue.tasks[i].sprint = this.sprintRepository.getByValue(sprint);
                this.issueRepository.update(issue.tasks[i].id, issue.tasks[i]);
            }
        }
        else{
            console.log("ENTERED SECOND " + sprint);
            issue.sprint = sprint;
            console.log("\nNewPart: " + issue.sprint);
            for (let i = 0; i < issue.tasks.length; i++) {
                issue.tasks[i].sprint = sprint;
                this.issueRepository.update(issue.tasks[i].id, issue.tasks[i]);
                console.log("\nNewPart2: " + this.issueRepository.get(issue.tasks[i].id));
            }
        }

        let actualComments = this.getComments(comments);
        if (actualComments !== issue.comments)
            issue.comments = actualComments;

        if (updatedAt !== issue.updatedAt)
            issue.updatedAt = updatedAt;
        if (createdAt !== issue.createdAt)
            issue.createdAt = createdAt;

        this.issueRepository.update(issue.id, issue);
        console.log("\nNewPart2: " + this.issueRepository.get(issue.id).sprint);
    }


    checkParentIsCompleted(issue){
        let unresolved = 0;
        for (let i = 0; i < issue.tasks.length; i++)
            if (issue.tasks[i] !== "Resolved" && issue.tasks[i] !== "Ready For Testing")
                unresolved += 1;
        if (unresolved < 2)
            return true;
        return false;
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

    getIssuesBySprint(sprintId){
        let result = [];
        let sprint = this.sprintRepository.get(sprintId);
        let repo = this.issueRepository.getAll();
        for(let i = 0; i < repo.length; i++)
            if (repo[i].sprint === sprint)
                result.push(repo[i]);
        return result;
    }

    getIssuesByStatus(statusId){
        let result = [];
        let status = this.statusRepository.get(statusId);
        let repo = this.issueRepository.getAll();
        for(let i = 0; i < repo.length; i++)
            if (repo[i].status === status)
                result.push(repo[i]);
        return result;
    }

    getAll(){
        return this.issueRepository.getAll();
    }
}

module.exports.CompundService = CompoundService;