const fs = require('fs');
const path = require('path');
const { check, validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');

let usuariosFilePath = path.join(__dirname, '../data/users.json');
let usuarios = JSON.parse(fs.readFileSync(usuariosFilePath));

let userController = {
    perfil: (req, res) => {
        res.render('profile');
    },

    registrar: (req, res) => {
        res.render('register');
    },

    procesarRegistro: (req, res) => {
        let errors = validationResult(req);
        let old = req.body;
        if(errors.isEmpty()) {

            let newUser = {
                id: (usuarios.length + 1),
                userName: req.body.userName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                avatar: req.file.originalname
            }
            if(newUser.avatar == undefined) {
                newUser.avatar = 'default.webp';
            }

            usuarios.push(newUser);

            fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios));

            res.redirect('/');
        }
        else {
            res.render('register', {errors: errors.mapped(), old: old});
        }

    },

    loguear: (req, res) => {
        req.session.usuarioLogueado = undefined;
        res.clearCookie('remember');
        res.render('login');
    },

    procesarLogueo: (req, res) => {
        let errors = validationResult(req);
        let old = req.body;
        if(errors.isEmpty()) {
            let usuarioALoguearse = null;
            for(let i = 0; i < usuarios.length; i++) {
                if(usuarios[i].userName == req.body.userName && bcrypt.compareSync(req.body.password, usuarios[i].password)) {
                    usuarioALoguearse = usuarios[i];
                    break;
                }
            }
            if(usuarioALoguearse == undefined) {
                res.render('login', {errors: [{msg: 'El usuario ingresado no existe.'}]});
            }

            req.session.usuarioLogueado = usuarioALoguearse;
            
            if(req.body.remember != undefined) {
                res.cookie('remember', usuarioALoguearse.id, {maxAge: 60000*2628000});
            }

            res.redirect('/');
        }
        else {
            res.render('login', {errors: errors.mapped(), old: old});
        }
    },

}

module.exports = userController;