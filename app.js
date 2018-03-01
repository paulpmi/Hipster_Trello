

function onRequest(request, response){
    response.writeHead(200, {'Content-Type': 'text/plain'});

    let test = require('./tests/userTest');
    test.addUser();
    response.write(test.readUser(0).name);

    test.addCommnet();
    response.write(test.readComment(0).name);

    test.addProject([0]);
    console.log("Project: " + test.readProject(0));

    test.addProject([0]);
    console.log("Project: " + test.readProject(1));

    test.addIssue();

    test.addSprint("Sprint 1");
    //response.write(test.readSprint(0).name);

    response.write(test.readIssue());

    test.updateIssue();

    test.addSprint("Sprint 2");
    response.write(test.readSprint(0).name);

    response.write(test.readIssue());

    response.write("\nSprint 2:\n " + test.filterBySprint());
    test.filterByStatus();

    response.end();
}

let http = require('http');

http.createServer(onRequest).listen(8080);