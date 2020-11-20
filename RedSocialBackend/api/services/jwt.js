'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret_key = "NorbertoEsElGatoMasLindoDelBackend"

function createToken(user){
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        lat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }

    try{
        return jwt.encode(payload, secret_key)
    }catch{
        console.log("Hubo error en la codificación del token")
    }
}

module.exports = {createToken}