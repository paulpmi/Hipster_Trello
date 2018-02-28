"use strict";

let genericRepositoryFile = require('./GenericRepository');
let GenericRepository = genericRepositoryFile.GenericRepository;

class ProjectRepository extends GenericRepository{
}


module.exports.ProjectRepository = ProjectRepository;
