const fs = require('fs');
const path = require('path');
const { check, validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const session = require('express-session');

let usuariosFilePath = path.join(__dirname, '../data/users.json');
let usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, {encoding: 'utf-8'}));

let userController = {
    perfil: (req, res) => {
        if(req.session.usuarioLogueado) {
            res.render('profile', {usuarioLogueado: req.session.usuarioLogueado, title: 'MyNotes | ' + usuarioLogueado.userName, css:"/css/profile.css"});
        }
        else {
            res.redirect('/user/login');
        }
    },

    registrar: (req, res) => {
        res.render('register', {title: 'MyNotes | Registrarme', css:"/css/register.css"});
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
                
            }
            if(req.file) {
                newUser.avatar = req.file.originalname;
            }
            else if(newUser.avatar == undefined) {
                newUser.avatar = 'default.webp';
            }

            usuarios.push(newUser);

            fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios));
            fs.writeFileSync(path.join(__dirname, `../data/notes/${newUser.userName}.json`), JSON.stringify([]));

            res.redirect('/');
        }
        else {
            res.render('register', {errors: errors.mapped(), old: old, title: 'MyNotes | Registrarme', css:"/css/register.css"});
        }

    },

    loguear: (req, res) => {
        req.session.usuarioLogueado = undefined;
        res.clearCookie('remember');
        res.clearCookie('session');
        res.render('login', {title: 'MyNotes | Iniciar Sesión', css:'/css/login.css'});
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
                res.render('login', {errors: [{msg: 'El usuario ingresado no existe.', title: 'MyNotes | Iniciar Sesión', css:'/css/login.css'}]});
            }

            req.session.usuarioLogueado = usuarioALoguearse;
            
            if(req.body.remember != undefined) {
                res.cookie('remember', usuarioALoguearse.id, {maxAge: 60000*2628000});
            } else {
                res.cookie('session', usuarioALoguearse.id, {maxAge: 1000000000000000000000000000000000000000 ** 1000000000000000000000000000000000000000});
            }

            res.redirect('/');
        }
        else {
            res.render('login', {errors: errors.mapped(), old: old, title: 'MyNotes | Iniciar Sesión', css:'/css/login.css'});
        }
    },

}

module.exports = userController;