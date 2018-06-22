const { Comments } = require( "../Entitites/Comments" );

class CommentsService {
    constructor( commnetsRepository ) {
        this.placementIssue = 0;
        this.commentsRepository = commnetsRepository;
    }

    addComment( commentName ) {
        if ( typeof commentName === "string" ) {
            const c = new Comments( this.placementIssue, commentName );
            this.commentsRepository.add( c );
            this.placementIssue += 1;
        }
    }

    getComment( position ) {
        return this.commentsRepository.get( position );
    }

    getAll() {
        return this.commentsRepository.getAll();
    }
}

module.exports.CommnetsService = CommentsService;
