

function onRequest(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});

    //tests
    /*
    let test = require('./tests/userTest');
    test.addUser();
    //response.write(test.readUser(0).name);

    test.addCommnet();
    //response.write(test.readComment(0).name);

    test.addProject([0]);
    console.log("Project: " + test.readProject(0));

    test.addProject([0]);
    console.log("Project: " + test.readProject(1));

    test.addIssue();

    test.addSprint("Sprint 1");
    //response.write(test.readSprint(0).name);

    //response.write(test.readIssue());

    test.updateIssue();

    test.addSprint("Sprint 2");
    //response.write(test.readSprint(0).name);

    //response.write(test.readIssue());

    //response.write("\nSprint 2:\n " + test.filterBySprint());
    test.filterByStatus();
    */

    let userRepoFile = require('./Repositories/UserRepository');
    let userServiceFile = require('./Service/UserService');
    let userService = new userServiceFile.UserService(new userRepoFile.UserRepository());

    userService.addUser("Paul");

    let commentRepoFile = require('./Repositories/CommentsRepository');
    let commentServiceFile = require('./Service/CommentsService');
    let commnetService = new commentServiceFile.CommnetsService(new commentRepoFile.CommentsRepository());

    commnetService.addComment("Great");
    commnetService.addComment("Great2");

    let status = require('./Entitites/Status');
    let statusRepoFile = require('./Repositories/StatusRepository');
    let statusRepository = new statusRepoFile.StatusRepository();
    statusRepository.add(new status.Status(0, "New"));
    statusRepository.add(new status.Status(1,"In Progress"));
    statusRepository.add(new status.Status(2,"Feedback"));
    statusRepository.add(new status.Status(3,"Rework"));
    statusRepository.add(new status.Status(4,"Resolved"));
    statusRepository.add(new status.Status(5,"Ready For Testing"));

    let sprintRepoFile = require('./Repositories/SprintRepository');
    let issueRepoFile = require('./Repositories/IssueRepository');
    let compoundServiceFile = require('./Service/CompoundService');

    let compountService = new compoundServiceFile.CompundService(new issueRepoFile.IssueRepository(),
        userService, new sprintRepoFile.SprintRepository(), commnetService, statusRepository);

    console.log(compountService.addIssueWithoutSubTasks("task", "BaseIssue01", "Sprint 0", 0, 0, "Description01", 0, [0, 1], "28/02/2018", "28/02/2018"));
    console.log(compountService.addIssueWithSubTasks("bug", "Issue01", "Sprint 0", 0, 0, "Description01", 0, [0], [0, 1], "28/02/2018", "28/02/2018"));
    console.log(
        compountService.updateIssue(0, "feature", "UpdatedBaseIssue01", "Sprint 0", 0, 0, "UpdatedDescription01", 4, [0], [0], "29/02/2018", "29/02/2018")
    );

    compountService.addSprint("Sprint 0");
    compountService.addSprint("Sprint 1");

    let projectRepoFile = require('./Repositories/ProjectRepository');
    let projectServiceFile = require('./Service/ProjectService');
    let projectService = new projectServiceFile.ProjectService(new projectRepoFile.ProjectRepository(), compountService);

    projectService.addProject([0, 1]);

    let form = "";
    let currentSelect = 0;

    if (request.method == "GET") {
        let fs = require('fs');
        let template = fs.readFileSync('tests/trial.html', 'utf-8');
        var ejs = require('ejs'),
            sprints = compountService.getAllSprints(),
            issues = compountService.getAllIssues(),
            html =
                ejs.render(template, {
                    sprints: sprints,
                    issues: issues,
                    compoundService: compountService,
                    currentSelect: currentSelect,
                    project: projectService.getProject(0),
                    statusRepo: statusRepository,
                    userService: userService,
                    commentService: commnetService
                });
        response.write(html);
        response.end();
    }
        if (request.method == "POST"){
        request.on(
                'data', (chunk) => {
                    let formData = chunk.toString();

                    console.log("FORMDATA: " + formData);
                    let data = formData.split("&");
                    currentSelect = data[0];
                    let checkMethod = data[1];
                    console.log("CHECKMETHOD: " + checkMethod);
                    if (checkMethod == "postIssueNoTasks"){
                        let issueType = data[2];
                        let issueName = data[3];
                        let issueSprint = data[4];
                        let issueCreator = data[5];
                        let issueAssignee = data[6];
                        let issueDescription = data[7];
                        let issueComments = data[8];
                        let d = new Date();

                        console.log("RESPONSE: " + compountService.addIssueWithoutSubTasks(issueType, issueName, issueSprint, issueCreator,
                            issueAssignee, issueDescription, 0, [issueComments], d.getDate(), d.getDate()));
                    }
                    if (checkMethod == "postIssue"){
                        let issueType = data[2];
                        let issueName = data[3];
                        let issueSprint = data[4];
                        let issueTasks = data[5];
                        let issueCreator = data[6];
                        let issueAssignee = data[7];
                        let issueDescription = data[8];
                        let issueComments = data[9];
                        let d = new Date();

                        compountService.addIssueWithoutSubTasks(issueType, issueName, issueSprint, issueCreator,
                            issueAssignee, issueDescription, 0, issueTasks, issueComments, d.getDate(), d.getDate());
                    }

                    let fs = require('fs');
                    let template = fs.readFileSync('tests/trial.html', 'utf-8');
                    var ejs = require('ejs'),
                        html =
                            ejs.render(template, {
                                compoundService: compountService,
                                currentSelect: currentSelect,
                                project: projectService.getProject(0),
                                statusRepo: statusRepository,
                                userService: userService,
                                commentService: commnetService
                                });
                    response.write(html);
                    response.end(html);

                    //response.writeHead(200);
                    //response.end(form);
            });
        }
}

let http = require('http');

http.createServer(onRequest).listen(8080);