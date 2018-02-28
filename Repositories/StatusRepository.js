/**
 * Created by paulp on 2/28/2018.
 */

let genericRepositoryFile = require('./GenericRepository');
let GenericRepository = genericRepositoryFile.GenericRepository;

class StatusRepository extends GenericRepository{
}

module.exports.StatusRepository = StatusRepository;