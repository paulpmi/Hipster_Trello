class Project {
    constructor( id, sprints ) {
        this.id = id;
        this.sprints = sprints;
        this.name = "FIRST PROJECT";
    }

    toString() {
        return this.sprints.reduce( ( acc, val ) => `${ val.name }</br>`, this.name );
    }
}

module.exports.Project = Project;
