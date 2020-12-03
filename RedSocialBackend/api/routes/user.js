'use strict'

let express = require('express');
let multipart = require('connect-multiparty')
let UserController = require('../controllers/user');
const { model } = require('../models/user');
let mid_auth = require('../middlewares/auth');

let md_upload = multipart({
    uploadDir: './uploads/users'
})

let api = express.Router() // Aquí están todos los métodos con los que nosotros podemos hacer cualquier tipo de peticiones get/post/patch...

api.get('/home', UserController.home);
api.get('/pruebas', mid_auth.validateAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUsers);
// Traer información de los usuarios
api.get('/user/:id', mid_auth.validateAuth, UserController.getUser);
api.get('/users/:page?', mid_auth.validateAuth, UserController.getUsers);
// Modificación de los datos del usuario
api.put('/update-user/:day', mid_auth.validateAuth, UserController.updateUser);
api.post('/upload-image/:id', [mid_auth.validateAuth, md_upload], UserController.updateImage);

module.exports = api;