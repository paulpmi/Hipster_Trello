"use strict";

let genericRepositoryFile = require('./GenericRepository');
let GenericRepository = genericRepositoryFile.GenericRepository;

class CommentsRepository extends GenericRepository{
}

module.exports.CommentsRepository = CommentsRepository;