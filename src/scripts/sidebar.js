document.addEventListener('DOMContentLoaded', () => {
    // Função para obter o cumprimento baseado na hora
    function getCumprimento() {
        const hora = new Date().getHours();
        if (hora >= 5 && hora < 12) return 'Bom Dia';
        if (hora >= 12 && hora < 18) return 'Boa Tarde';
        return 'Boa Noite';
    }

    // Atualiza as informações do usuário
    function atualizarInfoUsuario() {
        const token = sessionStorage.getItem("token");
        if (token) {
            const payload = parseJwt(token);
            if (payload?.nome) {
                const nomeUsuario = document.getElementById('nomeUsuario');
                const saudacao = document.getElementById('saudacao');
                
                if (nomeUsuario && saudacao) {
                    nomeUsuario.textContent = payload.nome;
                    saudacao.textContent = getCumprimento();
                }
            }
        }
    }

    // Função para marcar o botão ativo baseado na página atual
    function marcarBotaoAtivo() {
        const path = window.location.pathname;
        const buttons = document.querySelectorAll('.nav-button');
        
        buttons.forEach(button => button.classList.remove('active'));

        if (path.includes('inicio')) {
            document.getElementById('btn-inicio')?.classList.add('active');
        } else if (path.includes('transacoes')) {
            document.getElementById('btn-transacoes')?.classList.add('active');
        } else if (path.includes('usuario')) {
            document.getElementById('btn-usuario')?.classList.add('active');
        } else if (path.includes('analise')) {
            document.getElementById('btn-analise')?.classList.add('active');
        }
    }

    // Adiciona eventos de clique nos botões
    document.getElementById('btn-inicio')?.addEventListener('click', () => {
        window.location.href = '/src/views/home/home.html';
    });

    document.getElementById('btn-transacoes')?.addEventListener('click', () => {
        window.location.href = '/src/views/transacoes/transacoes.html';
    });

    document.getElementById('btn-usuario')?.addEventListener('click', () => {
        window.location.href = '/src/views/usuario/usuario.html';
    });

    document.getElementById('btn-analise')?.addEventListener('click', () => {
        window.location.href = '/src/views/analise/analise.html';
    });

    // Inicialização
    atualizarInfoUsuario();
    marcarBotaoAtivo();
}); 