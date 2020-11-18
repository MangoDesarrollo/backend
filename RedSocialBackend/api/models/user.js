'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    image: String,
    description: String
})

module.exports = mongoose.model("User", UserSchema);