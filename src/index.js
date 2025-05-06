const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');
const authRoutes = require('./routes/auth');
const usersRouters = require('./routes/users');
const transacaoRoutes = require('./routes/transacao');
const criarTabelas = require('./createTables'); // importa a criação das tabelas

const app = express();
app.use(cors({
    origin: true,  // permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', authRoutes);
app.use('/api', usersRouters);
app.use('/api', transacaoRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log('Iniciando criação das tabelas...');
        await criarTabelas();
        app.listen(PORT, () => {
            console.log(`✅ Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar o servidor:', error);
    }
}

app.use((req, res, next) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

startServer();
