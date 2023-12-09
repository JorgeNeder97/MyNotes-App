const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const upload = require('../modules/multer');

// Acceder a crear nueva nota y crearla luego
router.get('/newNote', noteController.new);
router.post('/newNote', upload.array('files'),noteController.processNew);

// Acceder al detalle de la nota, editar y eliminar
router.get('/:id', noteController.detail);
router.put('/:id', noteController.edit);
router.delete('/delete/:id', noteController.delete);


module.exports = router;