const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Acceder a crear nueva nota y crearla luego
router.get('/newNote', noteController.new);
router.post('/newNote', noteController.processNew);

// Acceder al detalle de la nota, editar y eliminar
router.get('/:id', noteController.detail);
router.put('/:id', noteController.edit);
router.delete('/:id', noteController.delete);


module.exports = router;