const { Sprint } = require( "../Entitites/Sprint" );
const { Issue } = require( "../Entitites/Issue" );

class CompoundService {
    constructor(
        issueRepository, userService,
        sprintRepository, commentService, statusRepository,
    ) {
        this.placementIssue = 0;
        this.placementSprint = 0;
        this.issueRepository = issueRepository;
        this.userService = userService;
        this.sprintService = sprintRepository;
        this.statusRepository = statusRepository;
        this.commentService = commentService;
    }

    addSprint( sprintName ) {
        if ( typeof sprintName === "string" ) {
            const s = new Sprint( this.placementSprint, sprintName );
            this.sprintService.add( s );
            this.placementSprint += 1;

            console.log( `HERE: ${ this.issueRepository.getAll().length }` );

            this.issueRepository.getAll().map( value => {
                console.log( `HERE: ${ value.sprint } vs ${ sprintName }` );
                if ( value.sprint === sprintName ) {
                    const replaceValue = value;
                    replaceValue.sprint = sprintName;
                    this.issueRepository.update( value.id, replaceValue );
                }
                return value;
            } );

            return this.placementSprint - 1;
        }
        return "Sprint Name is not a string";
    }

    getSprint( position ) {
        return this.sprintService.get( position );
    }

    getAllSprints() {
        return this.sprintService.getAll();
    }

    userValidation( issueCreatorId, issueAssigneeId ) {
        if ( typeof this.userService.getUser( issueCreatorId ) === "undefined" ) {
            return `No such creator: ${ issueCreatorId }`;
        }
        if ( typeof this.userService.getUser( issueAssigneeId ) === "undefined" ) {
            return `No such assignee: ${ issueAssigneeId }`;
        }

        return true;
    }

    taskValidation ( issueTaskIds, issueType ) {
        if ( issueTaskIds.length !== 0 ) {
            if ( issueType !== "task" ) {
                return this.getTasks( issueTaskIds );
            }
            return false;
        }
        return false;
    }

    baseValidation( issueType, issueName, issueDescription ) {
        if ( typeof issueType === "string"
            && typeof issueName === "string" && typeof issueDescription === "string" ) {
            return true;
        }
        return false;
    }

    addIssueWithSubTasks(
        issueType, issueName, issueSprintId, issueCreatorId, issueAssigneeId, issueDescription,
        issueStatusId, issueTaskIds, issueCommentIds, issueUpdate, issueCreated,
    ) {
        const baseValidator = this.baseValidation( issueType, issueName, issueDescription );
        if ( baseValidator ) {
            let comments = [];

            const validator = this.userValidation( issueCreatorId, issueAssigneeId );
            if ( !validator ) {
                return validator;
            }

            const tasks = this.taskValidation( issueTaskIds, issueType );

            console.log( `Tasks: ${ tasks }` );

            if ( tasks === false ) {
                return "Only Features and Bugs can have subtasks";
            }

            if ( issueCommentIds.length !== 0 ) {
                comments = this.getComments( issueCommentIds );
            }

            const sprint = this.sprintValidate( issueSprintId );

            const issue = new Issue(
                this.placementIssue, issueType, issueName, sprint,
                this.userService.getUser( issueCreatorId ),
                this.userService.getUser( issueAssigneeId ),
                issueDescription,
                this.statusRepository.get( 0 ),
                tasks, comments, issueUpdate, issueCreated,
            );
            this.issueRepository.add( issue );
            this.placementIssue += 1;
            return "IssueService: Success";
        }
        return "IssueService: Failure";
    }

    sprintValidate( issueSprintId ) {
        if ( typeof this.sprintService.get( issueSprintId ) === "undefined" ) {
            return issueSprintId;
        }
        return this.sprintService.get( issueSprintId );
    }

    validateIssue( issueSprintName ) {
        if ( this.sprintService.getByValue( issueSprintName ) != null ) {
            return this.sprintService.get( issueSprintName.split( " " )[ 1 ] );
        }
        return issueSprintName;
    }

    addIssueWithoutSubTasks(
        issueType, issueName, issueSprintName, issueCreatorId, issueAssigneeId, issueDescription,
        issueStatusId, issueCommentIds, issueUpdate, issueCreated,
    ) {
        if ( typeof issueType === "string"
            && typeof issueName === "string" && typeof issueDescription === "string" ) {
            const validator = this.userValidation( issueCreatorId );
            if ( !validator ) {
                return validator;
            }

            const comments = issueCommentIds.reduce( ( acc, value ) => {
                const comment = this.commentService.getComment( value );
                if ( typeof comment !== "undefined" ) {
                    acc.push( comment );
                }
                return acc;
            }, [] );

            console.log( "SPRINT: ", this.sprintService.getByValue( issueSprintName ) );

            const sprint = this.validateIssue( issueSprintName );

            console.log( `SPRINT: ${ sprint }` );

            const issue = new Issue(
                this.placementIssue, issueType, issueName, sprint,
                this.userService.getUser( issueCreatorId ),
                this.userService.getUser( issueAssigneeId ),
                issueDescription, this.statusRepository.get( 0 ),
                [], comments, issueUpdate, issueCreated,
            );
            this.issueRepository.add( issue );
            this.placementIssue += 1;
            return `IssueService: Success ${ issue }`;
        }
        return "IssueService: Failure";
    }

    getIssue( position ) {
        return this.issueRepository.get( position );
    }

    getComments( issueCommentIds ) {
        return issueCommentIds.reduce( ( acc, val ) => {
            const comm = this.getIssue( val );
            if ( typeof comm === "undefined" ) {
                acc.push( val );
            }
            return acc;
        }, [] );
    }

    getTasks( issueTaskIds ) {
        return issueTaskIds.reduce( ( acc, val ) => {
            const issue = this.getIssue( val );
            if ( typeof issue === "undefined" ) {
                acc.push( val );
            }
            return acc;
        }, [] );
    }

    updateIssueStatus( sentIssue, status ) {
        const issue = sentIssue;
        if ( this.statusRepository.get( status ) !== issue.status ) {
            if ( this.statusRepository.get( status ).name === "Resolved" ) {
                const parents = this.findParents( issue );
                parents.map( val => {
                    if ( this.checkParentIsCompleted( val ) ) {
                        const statuesVal = val;
                        statuesVal.status = this.statusRepository.get( 5 );
                        this.issueRepository.update( val.id, statuesVal );
                        return statuesVal;
                    }
                    return val;
                } );
                issue.status = this.statusRepository.get( status );
            } else {
                issue.status = this.statusRepository.get( status );
                this.updateParent( issue );
            }
        }
        return issue;
    }

    updateIssueSprint( sentIssue, sprint ) {
        const issue = sentIssue;
        if ( this.sprintService.getByValue( sprint ) !== issue.sprint
            && this.sprintService.getByValue( sprint ) !== null ) {
            issue.sprint = this.sprintService.getByValue( sprint );
            issue.tasks.map( ( acc, val ) => {
                const statuesVal = val;
                statuesVal.sprint = this.sprintService.getByValue( sprint );
                this.issueRepository.update( val.id, statuesVal );
                return val;
            } );
        } else {
            console.log( `ENTERED SECOND ${ sprint }` );
            issue.sprint = sprint;
            console.log( `\nNewPart: ${ issue.sprint }` );

            issue.tasks.map( ( acc, val ) => {
                const statuesVal = val;
                statuesVal.sprint = sprint;
                this.issueRepository.update( val.id, statuesVal );
                console.log( `\nNewPart2: ${ this.issueRepository.get( val.id ) }` );
                return val;
            } );
        }
        return issue;
    }

    updateIssueBaseTypes( sentIssue, type, name, description ) {
        const issue = sentIssue;
        if ( type !== issue.type ) {
            issue.type = type;
        }
        if ( name !== issue.name ) {
            issue.name = name;
        }
        if ( description !== issue.description ) {
            issue.description = description;
        }
        return issue;
    }

    updateIssueRelationTypes( sentIssue, createdBy, assignee ) {
        const issue = sentIssue;
        if ( this.userService.getUser( createdBy ) !== issue.creator ) {
            issue.creator = this.userService.getUser( createdBy );
        }
        if ( this.userService.getUser( assignee ) !== issue.assignee ) {
            issue.assignee = this.userService.getUser( assignee );
        }

        return issue;
    }

    updateIssue(
        id, type, name, sprint,
        createdBy, assignee, description, status, tasks, comments, updatedAt, createdAt,
    ) {
        let issue = this.getIssue( id );

        issue = this.updateIssueBaseTypes( issue, type, name, description );
        issue = this.updateIssueRelationTypes( issue, createdBy, assignee );

        const actualTasks = this.getTasks( tasks );
        if ( actualTasks !== issue.tasks ) {
            issue.tasks = actualTasks;
        }

        issue = this.updateIssueStatus( issue, status );

        issue = this.updateIssueSprint( issue, sprint );

        const actualComments = this.getComments( comments );

        if ( actualComments !== issue.comments ) {
            issue.comments = actualComments;
        }

        if ( updatedAt !== issue.updatedAt ) {
            issue.updatedAt = updatedAt;
        }
        if ( createdAt !== issue.createdAt ) {
            issue.createdAt = createdAt;
        }

        this.issueRepository.update( issue.id, issue );
        console.log( `\nNewPart2: ${ this.issueRepository.get( issue.id ).sprint }` );
    }

    checkParentIsCompleted( issue ) {
        const unresolved = issue.tasks.reduce( ( acc, val ) => {
            if ( val !== "Resolved" && val !== "Ready For Testing" ) {
                return acc + 1;
            }
            return acc;
        }, 0 );

        if ( unresolved < 2 ) {
            return true;
        }
        return false;
    }

    updateParent( issue ) {
        const parents = this.findParents( issue );
        parents.map( val => {
            const statuesVal = val;
            statuesVal.status = issue.status;
            this.issueRepository.update( val.id, statuesVal );
            return val;
        } );
    }

    findParents( issue ) {
        const repo = this.issueRepository.getAll();

        return repo.reduce( ( acc, val ) => {
            if ( val.tasks.includes( issue ) ) {
                acc.push( val );
            }
            return acc;
        }, [] );
    }

    getIssuesBySprint( sprintId ) {
        const sprint = this.sprintService.get( sprintId );
        const repo = this.issueRepository.getAll();

        return repo.reduce( ( acc, val ) => {
            if ( val.status === sprint ) {
                acc.push( val );
            }
            return acc;
        }, [] );
    }

    getIssuesByStatus( statusId ) {
        const status = this.statusRepository.get( statusId );
        const repo = this.issueRepository.getAll();

        return repo.reduce( ( acc, val ) => {
            if ( val.status === status ) {
                acc.push( val );
            }
            return acc;
        }, [] );
    }

    getAllIssues() {
        return this.issueRepository.getAll();
    }
}

module.exports.CompundService = CompoundService;
