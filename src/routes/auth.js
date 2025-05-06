const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const SECRET_KEY = process.env.JWT_SECRET || 'seusegredo';

router.post('/login', async (req, res) => {
  console.log('Requisição de login recebida');
  const { email, senha } = req.body;

  if (email === '' && senha === '') {
    console.log('Campos vazios recebidos');
    return res.status(400).json({ error: 'Email e senha não podem ser vazios.' });
  }

  try {
    console.log(`Buscando usuário ${email} no banco...`);
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      console.log('Email não encontrado:', email);
      return res.status(400).json({ error: 'Email inválido.' });
    }

    const user = result.rows[0];
    console.log('Verificando senha...');
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      console.log('Senha incorreta para usuário:', email);
      return res.status(400).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome, tipo: user.tipo },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    console.log('Login bem-sucedido para:', email);

    // Armazenar o token em um cookie com a flag HttpOnly
    res.cookie('token', token, {
      httpOnly: true, // Impede que o cookie seja acessado via JavaScript
      secure: process.env.NODE_ENV === 'production', // Só em HTTPS em produção
      maxAge: 60 * 60 * 1000, // 1 hora
      sameSite: 'Strict', // Ajuda a evitar ataques CSRF
    });

    console.log("Token enviado no cookie: ", token);

    res.json({ message: 'Login realizado com sucesso!' });

  } catch (err) {
    console.error('Erro ao fazer login:', { message: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// Cadastro
router.post('/register', async (req, res) => {
  console.log('Requisição de registro recebida');
  const { nome, email, senha } = req.body;

  try {
    console.log('Gerando hash da senha...');
    const hashedPassword = await bcrypt.hash(senha, 10);
    
    console.log('Inserindo novo usuário no banco...');
    const result = await pool.query(
      'INSERT INTO usuario (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id',
      [nome, email, hashedPassword, 'comum']
    );
    
    // Associando o id do usuário à sessão
    const userId = result.rows[0].id;
    req.session.user = { id: userId, nome, email, tipo: 'comum' };
    
    console.log('Usuário registrado com sucesso:', email);
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao registrar usuário:', { message: err.message, code: err.code, detail: err.detail });
    
    if (err.code === '23505') { // Violação de constraint única (email duplicado)
      res.status(400).json({ error: 'Email já está em uso' });
    } else {
      res.status(500).json({ 
        error: 'Erro ao registrar usuário',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
      });
    }
  }
});

// Alterar senha
router.post('/change-password', authenticateToken, async (req, res) => {
  console.log('Requisição de alteração de senha recebida');
  
  const { senhaAtual, novaSenha } = req.body;
  const userId = req.user.id;

  if (!senhaAtual || !novaSenha) {
    console.log('Campos obrigatórios faltando');
    return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
  }

  if (novaSenha.length < 6) {
    console.log('Nova senha muito curta');
    return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
  }

  try {
    console.log(`Buscando usuário ${userId} no banco...`);
    const userResult = await pool.query('SELECT * FROM usuario WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      console.log('Usuário não encontrado');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];
    console.log('Usuário encontrado:', user.email);
    
    console.log('Verificando senha atual...');
    const senhaCorreta = await bcrypt.compare(senhaAtual, user.senha);
    
    if (!senhaCorreta) {
      console.log('Senha atual incorreta');
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }
    
    console.log('Gerando hash da nova senha...');
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    
    console.log('Atualizando senha no banco...');
    await pool.query('UPDATE usuario SET senha = $1 WHERE id = $2', [hashedPassword, userId]);
    
    console.log('Gerando novo token...');
    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome, tipo: user.tipo },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    
    console.log('Senha alterada com sucesso para usuário:', user.email);

    // Armazenar o novo token em um cookie com a flag HttpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hora
      sameSite: 'Strict',
    });

    res.json({ message: 'Senha alterada com sucesso', token });

  } catch (err) {
    console.error('Erro completo ao alterar senha:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    res.status(500).json({ 
      error: 'Erro interno do servidor ao alterar senha',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
});

// Obter perfil do usuário atual
router.get('/me', authenticateToken, async (req, res) => {
  console.log('Requisição de perfil recebida para usuário:', req.user.id);

  // Não é necessário fazer a consulta ao banco de dados, pois o usuário já está no req.user
  const usuario = req.user;

  if (!usuario) {
    console.log('Usuário não encontrado no token, mas token era válido');
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  console.log('Perfil retornado com sucesso');
  res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    data_cadastro: usuario.data_cadastro,
  });
});


module.exports = router;