const { body } = require('express-validator');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let usuariosFilePath = path.join(__dirname, '../data/users.json');

let usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, {encoding: 'utf-8'}));

const validacionesLogueo = [
    body('userName').notEmpty().withMessage('Debes ingresar tu usuario para iniciar sesión').bail()
    .custom((value, {req}) => {
        let user;
        for(let i = 0; i < usuarios.length; i++) {
            if(req.body.userName == usuarios[i].userName) {
                user = usuarios[i].userName;
                return true;
            }
        }
        if(!user) {
            throw new Error('El usuario ingresado no existe.');
        }
    }),
    body('password').notEmpty().withMessage('Debes ingresar tu contraseña para iniciar sesión').bail()
    .custom((value, {req}) => {
        let password;
        for(let i = 0; i < usuarios.length; i++) {
            if(bcrypt.compareSync(req.body.password, usuarios[i].password) && req.body.userName == usuarios[i].userName) {
                password = usuarios[i].password;
                return true;
            }
        }
        if(!password) {
            throw new Error('La contraseña ingresada es incorrecta.');
        }
    })
];


module.exports = validacionesLogueo;