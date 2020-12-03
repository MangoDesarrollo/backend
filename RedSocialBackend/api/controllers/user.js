'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
let User = require('../models/user');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');
let path = require('path');
let fs = require('fs');
var fileupload = require("express-fileupload"); 


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

function updateUser(req, res){

    if(!req.params.id){
        return res.status(500).send({
            message: "No se envió el id del usuario"
        })
    }

    let userId = req.params.id;
    let userUpdate = req.body;

    delete userUpdate.password;

    if(userId != req.user.sub){
        return res.status(500).send({
            message: "El usuario no tiene permisos para modificar este usuario"
        })
    }

    User.findByIdAndUpdate(userId, userUpdate, {new:true}, (err, userUpdate)=> {
        if(err){
            return res.status(500).send({
                message: 'Error en actualización'
            })
        }

        if(!userUpdate){
            return res.status(500).send({
                message: 'No fueron enviados datos para hacer la actualiación'
            })
        }

        return res.status(200).send({
            userUpdate
        })

    })
}

// Cargar la foto del usuario

function updateImage(req, res){
    let userId = req.params.id;
    
    if(userId != req.user.sub){
        return res.status(500).send({
            message: "El usuario no tiene permisos para modificar este usuario"
        })
    }

    if(req.files){
        console.log("Hasta aqui va la solicitud");
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        console.log(file_split);

        let file_name = file_split[2];
        let ext_file = file_name.split('\.')[1];
        console.log(ext_file);
        
        if(ext_file == "png" | ext_file == "jpg" | ext_file == "gif" | ext_file == "svg"){
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) => {
                if(err){
                    return res.status(500).send({
                        message: "Hubo un error al actualizar la imagen"
                    })
                }

                if(!userUpdated){
                    return res.status(200).send({
                        message: "No se encontró un usuario para actualizar"
                    })
                }

                return res.status(200).send({
                    message: "La imagen se actualizó correctamente",
                    userUpdated
                })

            })
        }else{            
            fs.unlink(file_path, () => {
                return res.status(200).send({
                    message: "La extension del archivo no es correcta"
                })
            })
        }
    }else{
        return res.status(200).send({
            message: "No se ha cargado ningun archivo"
        })
    }
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUsers,
    getUser,
    getUsers,
    updateUser,
    updateImage
}