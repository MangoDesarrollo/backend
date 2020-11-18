'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = Schema({
    post : {type: Schema.ObjectId, ref: 'Post'},
    user: {type: Schema.ObjectId, ref: 'User'},
    content: String
})

module.exports = mongoose.model('Comment', CommentSchema);