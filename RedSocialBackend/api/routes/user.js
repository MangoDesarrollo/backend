'use strict'

let express = require('express');
let UserController = require('../controllers/user');
const { model } = require('../models/user');

let api = express.Router() // Aquí están todos los métodos con los que nosotros podemos hacer cualquier tipo de peticiones get/post/patch...

api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.post('/register', UserController.saveUser);

module.exports = api;