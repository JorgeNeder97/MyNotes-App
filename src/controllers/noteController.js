const fs = require('fs');
const path = require('path');

let notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/notes.json'), {encoding: 'utf-8'}));

let noteController = {
    
    new: (req, res) => {
        if(req.session.usuarioLogueado) {
            res.render('create', {usuarioLogueado: req.session.usuarioLogueado});
        }
        else {
            res.redirect('/user/login');
        }
    },

    processNew: (req, res) => {

    },

    detail: (req, res) => {
        let notaId = req.params.id;
        let nota = notes.find(note => note.id == notaId);
        if(req.session.usuarioLogueado) {
            res.render('detail', {usuarioLogueado: req.session.usuarioLogueado, nota: nota});
        }
        else {
            res.redirect('/user/login');
        }
    },

    edit: (req, res) => {
        
    },

    delete: (req, res) => {
        
    },

}



module.exports = noteController;