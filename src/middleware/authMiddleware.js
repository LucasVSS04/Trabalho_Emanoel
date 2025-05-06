const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'seusegredo';

function authenticateToken(req, res, next) {
  // Tenta pegar o token do cookie
  const token = req.cookies.token;

  if (!token) {
    console.log('Token não encontrado');
    return res.status(403).json({ error: 'Acesso negado. Token ausente.' });
  }

  // Verifica a validade do token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Token inválido');
      return res.status(403).json({ error: 'Token inválido.' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
