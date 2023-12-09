const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Pagina de inicio (login)
router.get('/', indexController.inicio);


module.exports = router;
