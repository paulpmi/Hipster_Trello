"use strict";

class UserService{

    constructor(userRepository){
        this.placement = 0;
        //this.userRepository = require('../Repositories/UserRepository');
        //this.userRepository = new this.userRepository.UserRepository();
        this.userRepository = userRepository;
    }

    addUser(userName){
        if (typeof userName == "string"){
            let user = require('../Entitites/User');
            let u = new user.User(this.placement, userName);
            this.userRepository.add(u);
            this.placement++;
        }
    }

    getUser(position){
        return this.userRepository.get(position);
    }
}

module.exports.UserService = UserService;