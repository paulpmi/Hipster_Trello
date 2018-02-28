"use strict";

let genericRepositoryFile = require('./GenericRepository');
let GenericRepository = genericRepositoryFile.GenericRepository;

class SprintRepository extends GenericRepository{
}

module.exports.SprintRepository = SprintRepository;