const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRouters = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', usersRouters);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});