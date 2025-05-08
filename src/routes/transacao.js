const express = require('express');
const router = express.Router();
const TransacaoController = require('../controllers/transacaoController');
const path = require('path');
const autenticarToken  = require('../middleware/authMiddleware');

// Rota para testar se está funcionando
router.get('/teste', (req, res) => {
    console.log('Rota de teste acessada');
    res.json({ message: 'API de transações está funcionando!' });
});

// Rota POST para criar transação
router.post('/', autenticarToken, async (req, res) => {
    console.log('Recebendo requisição POST para criar transação');  
    await TransacaoController.salvarTransacao(req, res);
});

// Rota GET para buscar o resumo geral
router.get('/resumo-geral/:id_usuario', autenticarToken, async (req, res) => {
    console.log('Recebendo requisição GET para resumo-geral');
    await TransacaoController.resumoGeral(req, res);
});

// Rota GET para calcular saldos
router.get('/saldos/:id_usuario', autenticarToken, async (req, res) => {
    console.log('Recebendo requisição GET para saldos');
    await TransacaoController.calcularSaldos(req, res);
});

// Rota GET para buscar transações do dia
router.get('/dia/:id_usuario', autenticarToken, async (req, res) => {
    console.log('Recebendo requisição GET para transações do dia');
    await TransacaoController.buscarTransacoesDoDia(req, res);
});

// Rota GET para buscar transações da semana
router.get('/semana/:id_usuario', autenticarToken, async (req, res) => {
    console.log('Recebendo requisição GET para transações da semana');
    await TransacaoController.buscarTransacoesDaSemana(req, res);
});

// Rota GET para buscar transações do mês
router.get('/mes/:id_usuario', autenticarToken, async (req, res) => {
    console.log('Recebendo requisição GET para transações do mês');
    await TransacaoController.buscarTransacoesDoMes(req, res);
});

// Rota GET para buscar todas as transações de um usuário
router.get('/:id_usuario', autenticarToken, async (req, res) => {
    console.log('Recebendo requisição GET para buscar todas as transações do usuário:', req.params.id_usuario);
    console.log('Usuário autenticado:', req.user);
    await TransacaoController.buscarTransacoes(req, res);
});

// Rotas para servir páginas HTML
router.get('/pagina', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/transacao/transacao.html'));
});

router.get('/pagina/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/transacao/criarTransacao.html'));
});

module.exports = router;
