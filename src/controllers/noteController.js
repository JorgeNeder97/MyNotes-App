const fs = require('fs');
const path = require('path');

let notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/notes.json')));

let noteController = {
    new: (req, res) => {
        res.render('create');
    },

    processNew: (req, res) => {

    },

    detail: (req, res) => {
        let notaId = req.params.id;
        let nota = notes.find(note => note.id == notaId);
        res.render('detail', {nota: nota});
    },

    edit: (req, res) => {
        
    },

    delete: (req, res) => {
        
    },

}



module.exports = noteController;