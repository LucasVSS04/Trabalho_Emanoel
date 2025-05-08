const pool = require("../db");

class TransacaoController {
  static async salvarTransacao(req, res) {
    const { valor, data, descricao, categoria } = req.body;

    if (!valor || !data || !descricao || !categoria) {
      return res
        .status(400)
        .json({ erro: "Todos os campos são obrigatórios." });
    }

    if (!req.user) {
      return res.status(400).json({ message: "Usuário não autenticado." });
    }

    const id_usuario = req.user.id;
    const categoriaId = await this.buscarCategoria(categoria);

    try {
      const result = await pool.query(
        "INSERT INTO transacao (valor, data, descricao, id_categoria, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [valor, data, descricao, categoriaId, id_usuario]
      );

      const transacaoId = result.rows[0].id;
      return res.status(201).json({
        mensagem: "Transação salva com sucesso",
        id_transacao: transacaoId,
      });
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      return res
        .status(500)
        .json({ erro: "Erro ao salvar a transação no banco de dados." });
    }
  }

  static async resumoGeral(req, res) {
    const { id_usuario } = req.params;

    try {
      const transacoesRecentesQuery = await pool.query(
        `SELECT * FROM transacao
                 WHERE id_usuario = $1
                 ORDER BY data DESC
                 LIMIT 3`,
        [id_usuario]
      );

      const resumoQuery = await pool.query(
        `SELECT valor FROM transacao
                 WHERE id_usuario = $1`,
        [id_usuario]
      );

      const valores = resumoQuery.rows.map((t) => t.valor);

      const receitasTotais = valores
        .filter((v) => v > 0)
        .reduce((acc, v) => acc + v, 0);
      const despesasTotais = valores
        .filter((v) => v < 0)
        .reduce((acc, v) => acc + v, 0);
      const saldoTotal = receitasTotais + despesasTotais;

      return res.status(200).json({
        transacoesRecentes: transacoesRecentesQuery.rows,
        saldoTotal,
        despesasTotais,
      });
    } catch (error) {
      console.error("Erro ao buscar resumo geral:", error);
      return res.status(500).json({ erro: "Erro ao buscar resumo geral." });
    }
  }

  static async buscarTransacoes(req, res) {
    const { id_usuario } = req.params;

    try {
      const result = await pool.query(
        "SELECT * FROM transacao WHERE id_usuario = $1 ORDER BY data DESC",
        [id_usuario]
      );

      const transacoes = result.rows;

      const receitasTotais = transacoes
        .filter((t) => t.valor > 0)
        .reduce((acc, t) => acc + t.valor, 0);

      const despesasTotais = transacoes
        .filter((t) => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0);

      const saldoTotal = receitasTotais + despesasTotais;
      const balancoTotal = saldoTotal;

      return res.status(200).json({
        transacoes,
        saldoTotal,
        despesasTotais,
        balancoTotal,
      });
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return res.status(500).json({ erro: "Erro ao buscar transações." });
    }
  }

  static async buscarTransacoesDoDia(req, res) {
    const { id_usuario } = req.params;

    try {
      const hoje = new Date();
      const dataAtual = hoje.toISOString().split("T")[0];

      const result = await pool.query(
        `SELECT * FROM transacao
                 WHERE id_usuario = $1
                 AND DATE(data) = $2
                 ORDER BY data DESC`,
        [id_usuario, dataAtual]
      );

      const transacoes = result.rows;

      const receitaDoDia = transacoes
        .filter((t) => t.valor > 0)
        .reduce((acc, t) => acc + t.valor, 0);

      const despesasDoDia = transacoes
        .filter((t) => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0);

      return res.status(200).json({
        receitaDoDia,
        despesasDoDia,
        transacoes,
      });
    } catch (error) {
      console.error("Erro ao buscar transações do dia:", error);
      return res
        .status(500)
        .json({ erro: "Erro ao buscar transações do dia." });
    }
  }

  static async buscarTransacoesDaSemana(req, res) {
    const { id_usuario } = req.params;

    try {
      const hoje = new Date();
      const seteDiasAtras = new Date(hoje);
      seteDiasAtras.setDate(hoje.getDate() - 7);

      const result = await pool.query(
        `SELECT * FROM transacao
                 WHERE id_usuario = $1
                 AND data >= $2
                 ORDER BY data DESC`,
        [id_usuario, seteDiasAtras]
      );

      const transacoes = result.rows;

      const receitaSemana = transacoes
        .filter((t) => t.valor > 0)
        .reduce((acc, t) => acc + t.valor, 0);

      const despesasSemana = transacoes
        .filter((t) => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0);

      return res.status(200).json({
        receitaSemana,
        despesasSemana,
        transacoes,
      });
    } catch (error) {
      console.error("Erro ao buscar transações da semana:", error);
      return res
        .status(500)
        .json({ erro: "Erro ao buscar transações da semana." });
    }
  }

  static async buscarTransacoesDoMes(req, res) {
    const { id_usuario } = req.params;

    try {
      const hoje = new Date();
      const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      const result = await pool.query(
        `SELECT * FROM transacao
                 WHERE id_usuario = $1
                 AND data >= $2
                 ORDER BY data DESC`,
        [id_usuario, primeiroDiaDoMes]
      );

      const transacoes = result.rows;

      const receitaDomes = transacoes
        .filter((t) => t.valor > 0)
        .reduce((acc, t) => acc + t.valor, 0);

      const despesasDomes = transacoes
        .filter((t) => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0);

      return res.status(200).json({
        receitaDomes,
        despesasDomes,
        transacoes,
      });
    } catch (error) {
      console.error("Erro ao buscar transações do mês:", error);
      return res
        .status(500)
        .json({ erro: "Erro ao buscar transações do mês." });
    }
  }

  static async calcularSaldos(req, res) {
    const { id_usuario } = req.params;
    try {
      const result = await pool.query(
        "SELECT * FROM transacao WHERE id_usuario = $1",
        [id_usuario]
      );

      const transacoes = result.rows;
      const receitasTotais = transacoes
        .filter((t) => t.valor > 0)
        .reduce((acc, t) => acc + t.valor, 0);
      const despesasTotais = transacoes
        .filter((t) => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0);
      const saldoTotal = receitasTotais + despesasTotais;

      return res.status(200).json({
        saldoTotal,
        despesasTotais,
      });
    } catch (error) {
      console.error("Erro ao calcular saldos:", error);
      return res.status(500).json({ erro: "Erro ao calcular saldos." });
    }
  }

  static async buscarCategoria(nome) {
    try {
      const result = await pool.query(
        "SELECT id FROM categoria WHERE nome = $1",
        [nome]
      );

      if (result.rows.length === 0) {
        return new Error("Categoria não encontrada");
      }
      console.log(result.rows[0].id);
      return result.rows[0].id;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return new Error("Categoria não encontrada");
    }
  }


}

module.exports = TransacaoController;
