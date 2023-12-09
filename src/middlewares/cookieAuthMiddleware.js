const fs = require('fs');
const path = require('path');

let usuariosFilePath = path.join(__dirname, '../data/users.json');
let usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, {encoding: 'utf-8'}));

function rememberMiddleware(req, res, next) {
    if(req.cookies.remember != undefined && req.session.usuarioLogueado == undefined) {
        let usuarioALoguearse = null;
        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].id == req.cookies.remember) {
                usuarioALoguearse = usuarios[i];
                break;
            }
        }
        req.session.usuarioLogueado = usuarioALoguearse;
    } else if(req.cookies.remember == undefined && req.session.usuarioLogueado == undefined) {
        let usuarioALoguearse = null;
        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].id == req.cookies.session) {
                usuarioALoguearse = usuarios[i];
                break;
            }
        }
        req.session.usuarioLogueado = usuarioALoguearse;
    }

    next();
}



module.exports = rememberMiddleware;