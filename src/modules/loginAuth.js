const { body } = require('express-validator');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let usuariosFilePath = path.join(__dirname, '../data/users.json');

let usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, {encoding: 'utf-8'}));

const validacionesLogueo = [
    body('userName').notEmpty().bail()
    .custom((value, {req}) => {
        let a = 0;
        for(let i = 0; i < usuarios.length; i++) {
            if(req.body.userName == usuarios[i].userName) {
                a = 1;
                return true;
            }
        }
        if(a = 0) {
            throw new Error('El usuario ingresado no existe.');
        }
    }),
    body('password').notEmpty().bail()
    .custom((value, {req}) => {
        let b = 0;
        for(let i = 0; i < usuarios.length; i++) {
            if(bcrypt.compareSync(req.body.password, usuarios[i].password)) {
                b = 1;
                return true;
            }
        }
        if(b = 0) {
            throw new Error('La contraseña ingresada es incorrecta.');
        }
    })
];


module.exports = validacionesLogueo;