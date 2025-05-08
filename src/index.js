const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const usersRouters = require('./routes/users');
const transacaoRoutes = require('./routes/transacao');
const usuarioRoutes = require('./routes/usuario');
const path = require('path');

console.log('Iniciando aplicação Express...');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5502', 'http://127.0.0.1:5502', 'http://localhost:5503'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('CORS configurado.');

// Configuração do cookie-parser
app.use(cookieParser());
console.log('Cookie-parser configurado.');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// Registrando rotas
console.log('Registrando rotas da API...');
app.use('/api', authRoutes);
app.use('/api', usersRouters);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/usuario', usuarioRoutes);
console.log('Rotas da API registradas.');

// Rota de teste direta
app.get('/teste', (req, res) => {
  res.json({ message: 'O servidor está funcionando!' });
});

// Rota de diagnóstico
app.get('/api/diagnostico', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'Servidor está operacional',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});