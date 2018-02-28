/**
 * Created by paulp on 2/28/2018.
 */

"use strict";

class GenericRepository{
    constructor(){
        this.repository = [];
    }

    add(sprint){
        this.repository.push(sprint);
    }

    get(position){
        return this.repository[position];
    }

    getAll(){
        return this.repository;
    }
}

module.exports.GenericRepository = GenericRepository;
