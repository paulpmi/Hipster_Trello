"use strict";

let genericRepositoryFile = require('./GenericRepository');
let GenericRepository = genericRepositoryFile.GenericRepository;

class UserRepository extends GenericRepository{
}


module.exports.UserRepository = UserRepository;