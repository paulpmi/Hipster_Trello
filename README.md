This is a small application made for the intent of scheduling Tasks inside a Sprint from a Project.
It uses vanilla NodeJs without any frameworks except for EJS for rendering items in the PureDOM.
Because of this limitation, the frontend part is clunky making Adding and Updating mandatory in the boot-up
code in order to check changes. Adding can be done from the page, but it will not show up due to no re-rendering
function.

Updating a task to Resolved changes it's parent to Ready for Testing if all the parents children are resolved using the
checkParent function.

When a parent changes its sprint all its children are updated to the parents sprint.

There are filters for Issues on Status and Sprint.

Creating Issues can be done without an existing Sprint and when a new Sprint is created
the Issues having the Sprint's name are updated to it.

Each Project can see how many Issues are in each Status, how many Sprints and
how many Issues in each Sprint.