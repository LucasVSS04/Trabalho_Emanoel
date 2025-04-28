const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// Cadastro
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      'INSERT INTO usuario (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id',
      [nome, email, hashedPassword, 'comum']
    );
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if(email === '' && senha === '') {
    return res.status(400).json({ error: 'Email e senha não podem ser vazios.' });
  }

  try {
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);

    if (result.rows.length === 0) return res.status(400).json({ error: 'Email inválido.' });

    const user = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) return res.status(400).json({ error: 'Senha incorreta.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome, tipo: user.tipo },
      'segredo_super_secreto',
      { expiresIn: '1h' }
    );


    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

module.exports = router;