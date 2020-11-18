'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
let User = require('../models/user');

function home(req, res){
    res.status(200).send(
    {saludo: "Holita a todos los desarrolladores"}
)}

function pruebas(req, res){
    res.status(200).send(
        {saludo: "Holita a todos los desarrolladores desde pruebas"}
    )
}

function saveUser(req, res){
    let params = req.body;
    let user = new User();

    if(params.name && params.email && params.username && params.password){
        user.name = params.name;
        user.email = params.email;
        user.username = params.username;
        user.image = null;
        user.description = null;

        bcrypt.hash(params.password, null, null, (err, hash) => {
            if(err){
                console.log("Error haciendo la encriptación del password");
            }
            else{               
                user.password = hash;
            }
            user.save((err, userStored) => {
                if(err) {
                    return res.status(500).send({
                        message: 'Error al guardar el usuario'
                    })
                }
                if(userStored){
                    res.status(200).send({
                        message: 'El usuario fue almacenado correctamente',
                        user: userStored
                    })
                }else{
                    res.status(404).send({
                        message: 'El usuario no pudo ser almacenado correctamente'
                    })
                }
            })
        })
        
    }else{
        res.status(200).send({
            message: "Enviar todos los campos"
        })
    }
}

module.exports = {
    home,
    pruebas,
    saveUser
}