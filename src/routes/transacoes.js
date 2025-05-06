const express = require('express');
const router = express.Router();
const TransacaoController = require('../controllers/TransacaoController');

router.post('/api/transacoes', TransacaoController.salvarTransacao);

module.exports = router;