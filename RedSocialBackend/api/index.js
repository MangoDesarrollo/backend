'use strict' // Utilizar todas las funcionalidades ECMASCRIPT 6 >

let mongoose = require('mongoose');
let app = require('./app');
let port = 3800;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/RedSocialDes', // Esta es la ruta de conexión de  la base de datos
    {useMongoClient: true})// Usar el cliente de mongo
    .then(() => {
        console.log("Hola este es un cambio---> La conexión se realizó correctamente")
        // Crear nuestro servidor
        app.listen(port, () => {
            console.log("El servidor fue creado correctamente y está corriendo en http://localhost:3800")
        })
    })
    .catch(err => console.log(err))