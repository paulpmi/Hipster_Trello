const { Project } = require( "../Entitites/Project" );

class ProjectService {
    constructor( projectRepository, sprintService ) {
        this.placementIssue = 0;
        this.projectRepository = projectRepository;
        this.sprintService = sprintService;
    }

    addProject( sprintIds ) {
        if ( !Array.isArray( sprintIds ) ) {
            return "Not a valid list of Ids";
        }

        const sprints = sprintIds.reduce( ( acc, val ) => {
            const sprint = this.sprintService.getAllSprints().filter( ( s ) => s.id === val );
            acc.push( sprint );
            return acc;
        }, [] );

        const p = new Project( this.placementIssue, sprints );

        this.projectRepository.add( this.placementIssue, p );
        this.placementIssue += 1;

        return "Succes";
    }

    getProject( position ) {
        return this.projectRepository.get( position );
    }
}

module.exports.ProjectService = ProjectService;
