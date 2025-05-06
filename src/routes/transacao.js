const express = require('express');
const router = express.Router();
const TransacaoController = require('../controllers/transacaoController');
const path = require('path');
const authenticateToken  = require('../middleware/authMiddleware');

router.post('/transacoes', authenticateToken, async (req, res) => {
    console.log('Recebendo requisição POST para /transacoes');  
    
    // Chama o controlador para salvar a transação
    await TransacaoController.salvarTransacao(req, res);
});

// Rota GET para buscar transações de um usuário
router.get('/transacoes/:id_usuario', authenticateToken, async (req, res) => {
    console.log('Recebendo requisição GET para /transacoes');
    // Chama o controlador para buscar as transações
    await TransacaoController.buscarTransacoes(req, res);
});

// Rota GET para calcular o saldo total e despesas totais de um usuário
router.get('/transacoes/saldos/:id_usuario', authenticateToken, async (req, res) => {
    console.log('Recebendo requisição GET para /transacoes/saldos');
    // Chama o controlador para calcular os saldos
    await TransacaoController.calcularSaldos(req, res);
});

// Rota para a página principal de transações
router.get('/transacao', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/transacao/transacao.html'));
});

// Rota para a página de criar transação
router.get('/transacao/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/transacao/criarTransacao.html'));
});

module.exports = router;
