class Issue {
    constructor(
        id, type, name, sprint, createdBy,
        assignee, description, status, tasks, comments, updatedAt, createdAt,
    ) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.sprint = sprint;
        this.creator = createdBy;
        this.assignee = assignee;
        this.description = description;
        this.status = status;
        this.tasks = tasks;
        this.comments = comments;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    toString() {
        let str = "\n";
        str += `Type: ${ this.type }</br>\n`;
        str += `Name: ${ this.name }</br>\n`;
        try {
            str += `Sprint: ${ this.sprint.name }</br>\n`;
        } catch ( e ) {
            str += `Sprint: ${ this.sprint }</br>\n`;
        }
        str += `Creator: ${ this.creator.name }</br>\n`;
        str += `Assignee: ${ this.assignee.name }</br>\n`;
        str += `Description: ${ this.description }</br>\n`;
        str += `Status: ${ this.status.name }</br>\n`;

        str += this.tasks.reduce( ( acc, val ) => `Task: ${ val.name }</br>\n`, "Tasks:\n" );

        str += this.comments.reduce( ( acc, val ) =>
            `Comment: ${ val.name }</br>\n`, "Comments:\n" );

        str += `Update: ${ this.updatedAt }</br>\n`;
        str += `Create: ${ this.createdAt }</br>\n`;
        return str;
    }
}

module.exports.Issue = Issue;
