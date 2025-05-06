const pool = require('../db');

class TransacaoController {
    static async salvarTransacao(req, res) {
        console.log('Dados recebidos:', req.body);
        console.log('Usuário ao tentar salvar transação:', req.user);

        const { valor, data, descricao, categoria } = req.body;

        console.log('valor:', valor, 'data:', data, 'descricao:', descricao, 'categoria:', categoria);

        if (!valor || !data || !descricao || !categoria) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
        }

        if (!req.user) {
            return res.status(400).json({ message: "Usuário não autenticado." });
        }
        
        const id_usuario = req.user.id;
        console.log ("Usuario:", id_usuario)

        try {
            // Inserção da nova transação no banco de dados
            const result = await pool.query(
                'INSERT INTO transacao (valor, data, descricao, categoria, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [valor, data, descricao, categoria, id_usuario]
            );

            // Retorna o ID da transação criada
            const transacaoId = result.rows[0].id;
            return res.status(201).json({ mensagem: 'Transação salva com sucesso', id_transacao: transacaoId });
        } catch (error) {
            console.error('Erro ao salvar transação:', error);
            return res.status(500).json({ erro: 'Erro ao salvar a transação no banco de dados.' });
        }
    }

    
    // Método para buscar transações de um usuário
    static async buscarTransacoes(req, res) {
        const { id_usuario } = req.params;
    
        try {
            // Buscar todas as transações do usuário no banco de dados
            const result = await pool.query(
                'SELECT * FROM transacao WHERE id_usuario = $1 ORDER BY data DESC',
                [id_usuario]
            );
    
            if (result.rows.length === 0) {
                return res.status(404).json({ mensagem: 'Nenhuma transação encontrada.' });
            }
    
            // Calcular o saldo total e as despesas totais
            const transacoes = result.rows;
    
            const saldoTotal = transacoes
                .filter(transacao => transacao.valor > 0)
                .reduce((acc, transacao) => acc + transacao.valor, 0);
    
            const despesasTotais = transacoes
                .filter(transacao => transacao.valor < 0)
                .reduce((acc, transacao) => acc + transacao.valor, 0);
    
            const balancoTotal = saldoTotal + despesasTotais;
    
            return res.status(200).json({
                transacoes,
                saldoTotal,
                despesasTotais,
                balancoTotal
            });
    
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
            return res.status(500).json({ erro: 'Erro ao buscar transações.' });
        }
    }
    

    // Método para buscar categorias de transações
    static async buscarCategorias(req, res) {
        try {
            // Buscar categorias no banco de dados
            const result = await pool.query(
                'SELECT DISTINCT categoria FROM transacao ORDER BY categoria'
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ mensagem: 'Nenhuma categoria encontrada.' });
            }

            return res.status(200).json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return res.status(500).json({ erro: 'Erro ao buscar categorias.' });
        }
    }
}

module.exports = TransacaoController;