'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = Schema({
    receiver: {type: Schema.ObjectId, ref: 'User'},
    emiter: {type: Schema.ObjectId, ref: 'User'},
    content: String
})

module.exports = mongoose.model('Message', MessageSchema);