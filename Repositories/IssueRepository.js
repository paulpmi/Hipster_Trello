"use strict";

let genericRepositoryFile = require('./GenericRepository');
let GenericRepository = genericRepositoryFile.GenericRepository;

class IssueRepository extends GenericRepository{
}


module.exports.IssueRepository = IssueRepository;