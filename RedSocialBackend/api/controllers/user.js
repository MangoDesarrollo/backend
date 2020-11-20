'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
let User = require('../models/user');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');

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

        User.find({
            $or:[{email: user.email.toLowerCase()}, {username: user.username.toLowerCase()}]
            }).exec((err, users) =>{
                console.log(users);
                // En caso de que haya un error enviamos un mensaje al usuario y un código 500
                if(err){
                    return res.status(500).send({
                        message: "Hubo un error en la petición"
                    })
                }
                if(users && users.length >=1){
                    return res.status(200).send({
                        message: "El usuario ya está registrado con ese nombre de usuario o con ese correo"
                    })
                }else{
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
                                return res.status(404).send({
                                    message: 'El usuario no pudo ser almacenado correctamente'
                                })
                            }
                        })
                    })
                }
            })        
    }else{
        res.status(200).send({
            message: "Enviar todos los campos"
        })
    }
}


function loginUsers(req, res){
    let params = req.body;
    
    if(params.email && params.password){
        
        let email = params.email;
        let password = params.password;
        User.findOne({email:email}, (err, user) => {
            if(err){ return res.status(500).send({message: "Hubo un error en la peticion del usuario"})}
            if(user){
                bcrypt.compare(password, user.password, (err, check) => {
                    if(err){
                        return res.status(500).send({message: "No se completo la solicitud, error"})
                    }
                    if(check){
                        if(params.gettoken){
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            user.password = undefined;
                            return res.status(200).send({user})
                        }
                    }else{
                        return res.status(200).send({message: "El usuario no está registrado, verificar o registrarse"})
                    }
                })
            }
        })
    }else{
        return res.status(200).send({
            message: "No se encontró el e-mail del usuario o la contraseña"
        })
    }
}

function getUser(req, res){
    let userId = req.params.id;

    User.findById(userId, (err, user) =>{
        if(err){
            return res.status(500).send({
                message: 'Hubo error en la petición'
            })
        }

        if(!user){
            return res.status(200).send({
                message: 'Usuario no encontrado'
            })
        }

        return res.status(200).send({user})

    })
}

function getUsers(req, res){
    let page = 1;

    if(req.params.page){
        page = req.params.page
    }

    let docsPerPage = 5;

    User.find().sort('_id').paginate(page, docsPerPage, (err, users, total) => {
        if(err){
            return res.status(500).send({
                message: 'Hubo un error consultando los usuarios'
            })
        }

        if(!users) return res.status(200).send({
            message: "No hay usuarios para mostrar"
        })

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/docsPerPage)
        })

    })
}

// Modificación de los datos del usuario

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUsers,
    getUser,
    getUsers
}