'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let app = express() // Cargar el framework de express para hacer las conexiones que necesitemos y montar el servidor

// Cargar rutas
let user_routes = require('../api/routes/user');

// Middelwares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors

// rutas
app.use('/api', user_routes);

module.exports = app;