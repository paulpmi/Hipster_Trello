"use strict";

class UserService{

    constructor(userRepository){
        this.placementIssue = 0;
        //this.userRepository = require('../Repositories/UserRepository');
        //this.userRepository = new this.userRepository.UserRepository();
        this.userRepository = userRepository;
    }

    addUser(userName){
        if (typeof userName == "string"){
            let user = require('../Entitites/User');
            let u = new user.User(this.placementIssue, userName);
            this.userRepository.add(u);
            this.placementIssue++;
        }
    }

    getUser(position){
        return this.userRepository.get(position);
    }

    getAll(){
        return this.userRepository.getAll();
    }
}

module.exports.UserService = UserService;