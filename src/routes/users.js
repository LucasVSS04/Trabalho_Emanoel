const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, "segredo_super_secreto", (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
};

// Obter detalhes do usuário atual
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, email, tipo FROM usuario WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar dados do usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Obter transações de um usuário
router.get("/transacoes/usuario/:id", authenticateToken, async (req, res) => {
  try {
    // Verificar se o usuário está tentando acessar seus próprios dados
    if (req.user.id !== parseInt(req.params.id) && req.user.tipo !== "admin") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const result = await pool.query(
      "SELECT * FROM transacao WHERE id_usuario = $1",
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Excluir todas as transações de um usuário
router.delete(
  "/transacoes/usuario/:id",
  authenticateToken,
  async (req, res) => {
    const client = await pool.connect();

    try {
      // Verificar se o usuário está tentando excluir seus próprios dados
      if (
        req.user.id !== parseInt(req.params.id) &&
        req.user.tipo !== "admin"
      ) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      await client.query("BEGIN");

      await client.query("DELETE FROM transacao WHERE id_usuario = $1", [
        req.params.id,
      ]);

      await client.query("COMMIT");
      res.json({ message: "Transações excluídas com sucesso" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Erro ao excluir transações:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      client.release();
    }
  }
);

// Excluir registros de notificação_usuario para um usuário
router.delete(
  "/notificacao-usuario/usuario/:id",
  authenticateToken,
  async (req, res) => {
    const client = await pool.connect();

    try {
      // Verificar se o usuário está tentando excluir seus próprios dados
      if (
        req.user.id !== parseInt(req.params.id) &&
        req.user.tipo !== "admin"
      ) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      await client.query("BEGIN");

      await client.query(
        "DELETE FROM notificacao_usuario WHERE id_usuario = $1",
        [req.params.id]
      );

      await client.query("COMMIT");
      res.json({ message: "Registros de notificação excluídos com sucesso" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Erro ao excluir registros de notificação:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      client.release();
    }
  }
);

// Excluir registros de relatorio_transacao para uma transação
router.delete(
  "/relatorio-transacao/transacao/:id",
  authenticateToken,
  async (req, res) => {
    const client = await pool.connect();

    try {
      // Verificar se a transação pertence ao usuário
      const transacaoResult = await client.query(
        "SELECT id_usuario FROM transacao WHERE id = $1",
        [req.params.id]
      );

      if (transacaoResult.rows.length === 0) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      const transacao = transacaoResult.rows[0];

      if (req.user.id !== transacao.id_usuario && req.user.tipo !== "admin") {
        return res.status(403).json({ error: "Acesso negado" });
      }

      await client.query("BEGIN");

      await client.query(
        "DELETE FROM relatorio_transacao WHERE id_transacao = $1",
        [req.params.id]
      );

      await client.query("COMMIT");
      res.json({ message: "Registros de relatório excluídos com sucesso" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Erro ao excluir registros de relatório:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      client.release();
    }
  }
);

// Excluir um usuário (e todas as suas dependências)
router.delete("/usuarios/:id", authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    // Verificar se o usuário está tentando excluir sua própria conta
    if (req.user.id !== parseInt(req.params.id) && req.user.tipo !== "admin") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    await client.query("BEGIN");

    // 1. Verificar se o usuário existe
    const userResult = await client.query(
      "SELECT * FROM usuario WHERE id = $1",
      [req.params.id]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // 2. Excluir o usuário
    await client.query("DELETE FROM usuario WHERE id = $1", [req.params.id]);

    await client.query("COMMIT");
    res.json({ message: "Usuário excluído com sucesso" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao excluir usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  } finally {
    client.release();
  }
});

router.patch("/usuarios/:id", authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id); // Usar o ID do token, não do parâmetro
  const { nome, email } = req.body;

  // Verificar se o nome e email foram fornecidos
  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  try {
    // Verificar se o usuário existe
    const userResult = await pool.query("SELECT * FROM usuario WHERE id = $1", [
      id,
    ]);

    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Usuário id: ${id} não encontrado` });
    }

    // Atualizar o perfil do usuário
    await pool.query(
      `
        UPDATE usuario
        SET nome = $1,
            email = $2
        WHERE id = $3
      `,
      [nome, email, id]
    );

    // Gerar um novo token com os dados atualizados
    const updatedUser = {
      id: id,
      email: email,
      nome: nome,
      tipo: userResult.rows[0].tipo, // Mantém o tipo de usuário
    };

    const token = jwt.sign(updatedUser, "segredo_super_secreto", {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Perfil atualizado com sucesso",
      token: token, // Retorna o token atualizado
    });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
