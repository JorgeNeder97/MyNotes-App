const { body } = require('express-validator');
const fs = require('fs');
const path = require('path');

const usuariosFilePath = path.join(__dirname, '../data/users.json');

const usuarios = JSON.parse(fs.readFileSync(usuariosFilePath));

const validacionesRegistro = [
    
    // Nombre de usuario
    body('userName').notEmpty().withMessage('Este campo es obligatorio.').bail()
    .isLength({min: 5, max: 15}).withMessage('El nombre de usuario debe contener entre 5 y 15 caracteres.').bail()
    .custom((value, {req}) => {
        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].userName.toLowerCase() == req.body.userName.toLowerCase()) {
                throw new Error('Este nombre de usuario ya esta en uso.');
                break;
            }
        }
        return true;
    }),

    // Email
    body('email').notEmpty().withMessage('Este campo es obligatorio.').bail()
    .isEmail().withMessage('Debes ingresar un email válido').bail()
    .custom((value, {req}) => {
        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].email.toLowerCase() == req.body.email.toLowerCase()) {
                throw new Error('El email ingresado corresponde a un usuario registrado.');
                break;
            }
        }
        return true;
    }),

    // Password
    body('password').notEmpty().withMessage('Este campo es obligatorio.').bail()
    .isLength({min: 8}).withMessage('La contraseña debe contener al menos 8 caracteres.'),
    
    // Confirm Password
    body('rePassword').notEmpty().withMessage('Este campo es obligatorio.').bail()
    .isLength({min: 8}).withMessage('La contraseña debe contener al menos 8 caracteres.').bail()
    .custom((value, {req}) => {
        let pass1 = req.body.password;
        let pass2 = req.body.rePassword;

        if(pass2 != pass1) {
            throw new Error('Las contraseñas deben coincidir');
        }

        return true;
    }),

    // Terms & Conditions
    body('terms').notEmpty().withMessage('Este campo es obligatorio.')

];

module.exports = validacionesRegistro;