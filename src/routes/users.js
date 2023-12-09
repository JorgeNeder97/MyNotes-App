const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../modules/multer');
const validacionesRegistro = require('../modules/registerAuth');
const validacionesLogueo = require('../modules/loginAuth');


// Acceder al perfil de usuario
router.get('/', userController.perfil);

// Acceder al formulario de registro y enviar el formulario de registro
router.get('/register', userController.registrar);
router.post('/register', upload.single('avatar'), validacionesRegistro, userController.procesarRegistro);

// Acceder al login y enviar la información de logueo
router.get('/login', userController.loguear);
router.post('/login', validacionesLogueo, userController.procesarLogueo);

router.get('/check', (req, res) => {
    if(req.session.usuarioLogueado == undefined){
        res.send('No estas logueado');
    } else {
        res.send("El usuario logueado es: " + req.session.usuarioLogueado.userName);
    }
});


module.exports = router;
