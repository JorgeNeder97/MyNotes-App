const fs = require('fs');
const path = require('path');
const { check, validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');


let usuariosFilePath = path.join(__dirname, '../data/users.json');
let usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, {encoding: 'utf-8'}));



let userController = {

    perfil: (req, res) => {
        if(req.session.usuarioLogueado) {
            res.render('perfil', {usuarioLogueado: req.session.usuarioLogueado , title: `MyNotes | ${req.session.usuarioLogueado.userName}`, css:"/css/profile.css"});
        }
        else {
            res.redirect('/user/login');
        }

    },

    processPerfil: (req, res) => {
        
        let usuarioId = req.params.id;
        let usuarioActual;

        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].id == usuarioId){
                usuarioActual = usuarios[i];
            }
        }

        if(req.file) {
            if(usuarioActual.avatar != undefined && usuarioActual.avatar != 'default.png') {
                fs.unlinkSync(path.join(__dirname, `../../public/img/profile-img/${usuarioActual.avatar}`));
            }
            usuarioActual.avatar = req.file.filename;
        }
        else {
            if(usuarioActual.avatar != undefined && usuarioActual.avatar != 'default.png') {
                fs.unlinkSync(path.join(__dirname, `../../public/img/profile-img/${usuarioActual.avatar}`));
            }
            usuarioActual.avatar = 'default.png';
        }

        let indice = usuarios.findIndex(user => user.id == usuarioActual.id);

        usuarios.splice(indice, 1, usuarioActual);

        fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios));

        res.redirect(`/user/perfil/${usuarioId}`);
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
                newUser.avatar = req.file.filename;
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

    deletePerfil: (req, res) => {
        let usuarioId = req.params.id;
        let usuarioActual;
        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].id == usuarioId) {
                usuarioActual = usuarios[i];
            }
        }

        fs.unlinkSync(path.join(__dirname, `../../public/img/profile-img/${usuarioActual.avatar}`));

        fs.unlinkSync(path.join(__dirname, `../data/notes/${usuarioActual.userName}.json`));

        let indice = usuarios.findIndex(user => user.id == usuarioId);

        usuarios.splice(indice, 1);

        for(let i = 0; i < usuarios.length; i++) {
            usuarios[i].id = i;
        }

        fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios));

        res.redirect('/user/login');
    },

}

module.exports = userController;