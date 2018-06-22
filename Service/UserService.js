const { User } = require( "../Entitites/User" );

class UserService {
    constructor( userRepository ) {
        this.placementIssue = 0;
        this.userRepository = userRepository;
    }

    addUser( userName ) {
        if ( typeof userName === "string" ) {
            const u = new User( this.placementIssue, userName );
            this.userRepository.add( u );
            this.placementIssue += 1;
        }
    }

    getUser( position ) {
        return this.userRepository.get( position );
    }

    getAll() {
        return this.userRepository.getAll();
    }
}

module.exports.UserService = UserService;
