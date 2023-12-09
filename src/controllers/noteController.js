const fs = require('fs');
const path = require('path');

let notesFilePath = path.join(__dirname, '../data/notes.json');
let notes = JSON.parse(fs.readFileSync(notesFilePath, {encoding: 'utf-8'}));

let noteController = {
    
    new: (req, res) => {
        if(req.session.usuarioLogueado) {
            res.render('create', {usuarioLogueado: req.session.usuarioLogueado, title:'MyNotes | Crear Nota', css: 'css/create.css'});
        }
        else {
            res.redirect('/user/login');
        }
    },

    processNew: (req, res) => {
        let nuevaNota = {
            userId: req.session.usuarioLogueado.id,
            id: notes.length + 1,
            title: req.body.title,
            content: req.body.content,
            files: []
        }

        
        let archivos = req.files;
        for(let i = 0; i < archivos.length; i++) {
            nuevaNota.files.push(archivos[i].originalname);
        }
        
        notes.push(nuevaNota);

        fs.writeFileSync(notesFilePath, JSON.stringify(notes));

        res.redirect('/');
    },

    detail: (req, res) => {
        let notaId = req.params.id;
        let nota = notes.find(note => note.id == notaId);
        if(req.session.usuarioLogueado) {
            res.render('detail', {usuarioLogueado: req.session.usuarioLogueado, nota: nota, title:'MyNotes | Editar Nota', css: 'css/detail.css'});
        }
        else {
            res.redirect('/user/login');
        }
    },

    edit: (req, res) => {
        let notaId = req.params.id;
        let notaAModificar = notes.find(nota => nota.id == notaId);

        notaAModificar.title = req.body.title;
        notaAModificar.content = req.body.content;

        let indiceNota = notes.findIndex(nota => nota.id == notaId);

        notes.splice(indiceNota, 1, notaAModificar);

        fs.writeFileSync(notesFilePath, JSON.stringify(notes));

        res.redirect('/');
    },

    delete: (req, res) => {
        let deleteId = req.params.id;
        let indice = notes.findIndex(nota => nota.id == deleteId);

        notes.splice(indice, 1);

        console.log(notes);
        fs.writeFileSync(notesFilePath, JSON.stringify(notes));

        res.redirect('/');
    }

}



module.exports = noteController;