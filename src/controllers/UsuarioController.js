const pool = require('../db');

class UsuarioController {
    async info(req, res) {
        try {
            // Por enquanto, retornando um usuário fixo
            // TODO: Implementar autenticação real
            return res.status(200).json({
                id: 1,
                nome: 'Usuário',
                email: 'usuario@exemplo.com'
            });
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            return res.status(500).json({ erro: 'Erro ao buscar informações do usuário' });
        }
    }
}

module.exports = new UsuarioController(); 