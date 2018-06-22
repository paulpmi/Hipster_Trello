class GenericRepository {
    constructor() {
        this.repository = [];
    }

    add( sprint ) {
        this.repository.push( sprint );
    }

    get( position ) {
        return this.repository[ position ];
    }

    getAll() {
        return this.repository;
    }

    getByValue( value ) {
        return this.repository.reduce( ( acc, val ) => {
            if ( val === value ) {
                return value;
            }
            return acc;
        }, null );
    }

    update( position, newVal ) {
        this.repository[ position ] = newVal;
    }

    delete( position ) {
        delete this.repository[ position ];
    }
}

module.exports.GenericRepository = GenericRepository;
