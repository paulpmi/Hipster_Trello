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

    getByValue(value){
        for (let i = 0; i < this.repository.length; i++)
            if (this.repository[i] === value)
                return this.repository[i];
        return null;
    }

    update(position, newVal){
        this.repository[position] = newVal;
    }

    delete(position){
        delete this.repository[position];
    }
}

module.exports.GenericRepository = GenericRepository;
