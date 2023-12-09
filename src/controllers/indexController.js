const fs = require('fs');
const path = require('path');

// Leemos los usuarios del JSON
let usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), {encoding: 'utf-8'}));

let indexController = {
    inicio: (req, res) => {
        if(req.session.usuarioLogueado) {
            res.render('index', {usuarioLogueado: req.session.usuarioLogueado});
        }
        else {
            res.redirect('/user/login');
        }
    }

}


module.exports = indexController;