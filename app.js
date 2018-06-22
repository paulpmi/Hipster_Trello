const test = require( "./tests/userTest" );
const { UserRepository } = require( "./Repositories/UserRepository" );
const { UserService } = require( "./Service/UserService" );
const { CommentsRepository } = require( "./Repositories/CommentsRepository" );
const { CommnetsService } = require( "./Service/CommentsService" );
const { Status } = require( "./Entitites/Status" );
const { StatusRepository } = require( "./Repositories/StatusRepository" );
const { SprintRepository } = require( "./Repositories/SprintRepository" );
const { IssueRepository } = require( "./Repositories/IssueRepository" );
const { CompundService } = require( "./Service/CompoundService" );
const { ProjectRepository } = require( "./Repositories/ProjectRepository" );
const { ProjectService } = require( "./Service/ProjectService" );

const fs = require( "fs" );
const ejs = require( "ejs" );
const http = require( "http" );

function onRequest( request, response ) {
    response.writeHead( 200, { "Content-Type": "text/html" } );

    // tests

    test.addUser();
    response.write( test.readUser( 0 ).name );

    test.addCommnet();
    response.write( test.readComment( 0 ).name );

    test.addProject( [ 0 ] );
    console.log( `Project: ${ test.readProject( 0 ) }` );

    test.addProject( [ 0 ] );
    console.log( `Project: ${ test.readProject( 1 ) }` );

    test.addIssue();

    test.addSprint( "Sprint 1" );
    response.write( test.readSprint( 0 ).name );

    response.write( test.readIssue() );

    test.updateIssue();

    test.addSprint( "Sprint 2" );
    response.write( test.readSprint( 0 ).name );

    response.write( test.readIssue() );

    response.write( `\nSprint 2:\n ${ test.filterBySprint() }` );
    test.filterByStatus();

    const userService = new UserService( new UserRepository() );

    userService.addUser( "Paul" );

    const commnetService = new CommnetsService( new CommentsRepository() );

    commnetService.addComment( "Great" );
    commnetService.addComment( "Great2" );

    const statusRepository = new StatusRepository();
    statusRepository.add( new Status( 0, "New" ) );
    statusRepository.add( new Status( 1, "In Progress" ) );
    statusRepository.add( new Status( 2, "Feedback" ) );
    statusRepository.add( new Status( 3, "Rework" ) );
    statusRepository.add( new Status( 4, "Resolved" ) );
    statusRepository.add( new Status( 5, "Ready For Testing" ) );

    const compountService = new CompundService(
        new IssueRepository(),
        userService, new SprintRepository(), commnetService, statusRepository,
    );

    // create issues
    console.log( compountService.addIssueWithoutSubTasks( "task", "BaseIssue01", "Sprint 0", 0, 0, "Description01", 0, [ 0, 1 ], "28/02/2018", "28/02/2018" ) );
    console.log( compountService.addIssueWithoutSubTasks( "task", "BaseIssue02", "Sprint 0", 0, 0, "Description01", 0, [ 0, 1 ], "28/02/2018", "28/02/2018" ) );
    console.log( compountService.addIssueWithSubTasks( "bug", "Issue01", "Sprint 0", 0, 0, "Description01", 0, [ 0, 1 ], [ 0, 1 ], "28/02/2018", "28/02/2018" ) );
    console.log( `BUG? : ${ compountService.addIssueWithSubTasks( "feature", "Issue02", "Sprint 0", 0, 0, "Description01", 0, [ 0 ], [ 0 ], "28/02/2018", "28/02/2018" ) }` );
    compountService.addIssueWithSubTasks( "feature", "Issue03", "Sprint 0", 0, 0, "Description01", 0, [ 0 ], [ 0 ], "28/02/2018", "28/02/2018" );

    // update issues

    // this will update its parent to Ready For Testing
    console.log( compountService.updateIssue( 0, "feature", "UpdatedBaseIssue01", "Sprint 0", 0, 0, "UpdatedDescription01", 4, [ 0 ], [ 0 ], "29/02/2018", "29/02/2018" ) );

    // this will update its child to Sprint 1
    compountService.updateIssue( 4, "feature", "UpdatedIssue03", "Sprint 1", 0, 0, "Used to be in Sprint 0", 4, [ 1 ], [ 0 ], "29/02/2018", "29/02/2018" );

    // compountService.updateIssue(1, "feature", "UpdatedBaseIssue02", "Sprint 1", 0, 0, "UpdatedDescription01", 4, [], [0], "29/02/2018", "29/02/2018")

    compountService.addSprint( "Sprint 0" );
    compountService.addSprint( "Sprint 1" );
    compountService.addSprint( "Sprint 2" );
    compountService.addSprint( "Sprint 3" );

    const projectService = new ProjectService( new ProjectRepository(), compountService );

    projectService.addProject( [ 0, 1 ] );

    let currentSelect = 0;

    if ( request.method === "GET" ) {
        const template = fs.readFileSync( "tests/trial.html", "utf-8" );
        const sprints = compountService.getAllSprints();
        const issues = compountService.getAllIssues();
        const html =
                ejs.render( template, {
                    sprints,
                    issues,
                    compoundService: compountService,
                    currentSelect,
                    project: projectService.getProject( 0 ),
                    statusRepo: statusRepository,
                    userService,
                    commentService: commnetService,
                } );
        response.write( html );
        response.end();
    }
    if ( request.method === "POST" ) {
        request.on( "data", ( chunk ) => {
            const formData = chunk.toString();

            console.log( `FORMDATA: ${ formData }` );
            const data = formData.split( "&" );
            const [ car ] = data;
            currentSelect = car;
            const checkMethod = data[ 1 ];
            console.log( `CHECKMETHOD: ${ checkMethod }` );
            if ( checkMethod === "postIssueNoTasks" ) {
                const issueType = data[ 2 ];
                const issueName = data[ 3 ];
                const issueSprint = data[ 4 ];
                const issueCreator = data[ 5 ];
                const issueAssignee = data[ 6 ];
                const issueDescription = data[ 7 ];
                const issueComments = data[ 8 ];
                const d = new Date();

                console.log( `RESPONSE: ${ compountService.addIssueWithoutSubTasks(
                    issueType, issueName, issueSprint, issueCreator,
                    issueAssignee, issueDescription, 0, [ issueComments ], d.getDate(), d.getDate(),
                ) }` );
                compountService.addIssueWithoutSubTasks(
                    issueType, issueName, issueSprint, issueCreator,
                    issueAssignee, issueDescription, 0, [ issueComments ], d.getDate(), d.getDate(),
                );
            }
            if ( checkMethod === "postIssue" ) {
                const issueType = data[ 2 ];
                const issueName = data[ 3 ];
                const issueSprint = data[ 4 ];
                const issueTasks = data[ 5 ];
                const issueCreator = data[ 6 ];
                const issueAssignee = data[ 7 ];
                const issueDescription = data[ 8 ];
                const issueComments = data[ 9 ];
                const d = new Date();

                compountService.addIssueWithSubTasks(
                    issueType, issueName, issueSprint, issueCreator,
                    issueAssignee, issueDescription, 0, issueTasks, issueComments, d.getDate(), d.getDate(),
                );
            }
            if ( checkMethod === "postSprint" ) {
                const sprintName = data[ 2 ];

                compountService.addSprint( sprintName );
            }

            const template = fs.readFileSync( "tests/trial.html", "utf-8" );
            const html =
                            ejs.render( template, {
                                compoundService: compountService,
                                currentSelect,
                                project: projectService.getProject( 0 ),
                                statusRepo: statusRepository,
                                userService,
                                commentService: commnetService,
                            } );
            response.write( html );
            response.end( html );
        } );
    }
}

http.createServer( onRequest ).listen( 8080 );
