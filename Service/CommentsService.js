/**
 * Created by paulp on 2/28/2018.
 */

"use strict";

class CommentsService{

    constructor(commnetsRepository){
        this.placementIssue = 0;
        this.commentsRepository = commnetsRepository;
    }

    addComment(commentName){
        if (typeof commentName == "string"){
            let comment = require('../Entitites/Comments');
            let c = new comment.Comments(this.placementIssue, commentName);
            this.commentsRepository.add(c);
            this.placementIssue++;
        }
    }

    getComment(position){
        return this.commentsRepository.get(position);
    }

    getAll(){
        return this.commentsRepository.getAll();
    }
}

module.exports.CommnetsService = CommentsService;