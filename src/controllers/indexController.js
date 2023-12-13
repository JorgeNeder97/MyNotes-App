const fs = require('fs');
const path = require('path');

// Leemos los usuarios del JSON
let usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, `../data/users.json`), {encoding: 'utf-8'}));

// Leemos las notas de los usuarios

let indexController = {
    inicio: (req, res) => {
        if(req.session.usuarioLogueado) {

            let notesFilePath = path.join(__dirname, `../data/notes/${req.session.usuarioLogueado.userName}.json`);
            let notes = JSON.parse(fs.readFileSync(notesFilePath, {encoding: 'utf-8'}));

            res.render('index', {usuarioLogueado: req.session.usuarioLogueado, notes: notes, title: 'MyNotes', css: "/css/index.css"});
        }
        else {
            res.redirect('/user/login');
        }
    }

}


module.exports = indexController;