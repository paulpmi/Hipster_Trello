/**
 * Created by paulp on 2/28/2018.
 */

"use strict";

class CommentsService{

    constructor(commnetsRepository){
        this.placement = 0;
        this.commentsRepository = commnetsRepository;
    }

    addComment(commentName){
        if (typeof commentName == "string"){
            let comment = require('../Entitites/Comments');
            let c = new comment.Comments(this.placement, commentName);
            this.commentsRepository.add(c);
            this.placement++;
        }
    }

    getComment(position){
        return this.commentsRepository.get(position);
    }
}

module.exports.CommnetsService = CommentsService;