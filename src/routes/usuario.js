const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// Rota para obter informações do usuário
router.get('/info', UsuarioController.info);

module.exports = router; 