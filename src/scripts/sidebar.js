document.addEventListener('DOMContentLoaded', () => {
    // Aplicar tema escuro se estiver ativado
    applyDarkModeIfEnabled();
    
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
        if (window.location.pathname.includes('/src/views/home')) {
            return;
        }
        window.location.href = '/src/views/home/dia/tela_dashboard_dia.html';
    });

    document.getElementById('btn-transacoes')?.addEventListener('click', () => {
        if (window.location.pathname.includes('/src/views/transacao/transacao.html')) {
            return;
        }
        window.location.href = '/src/views/transacao/transacao.html';
    });

    document.getElementById('btn-usuario')?.addEventListener('click', () => {
        if (window.location.pathname.includes('/src/views/user/user.html')) {
            return;
        }
        window.location.href = '/src/views/user/user.html';
    });

    document.getElementById('btn-analise')?.addEventListener('click', () => {
        if (window.location.pathname.includes('/src/views/analise/analise.html')) {
            return;
        }
        window.location.href = '/src/views/analise/analise.html';
    });
    
    // Inicializar tema escuro
    initDarkModeSupport();

    // Inicialização
    atualizarInfoUsuario();
    marcarBotaoAtivo();
});

// Função para aplicar tema escuro se estiver ativado
function applyDarkModeIfEnabled() {
    // Verificar se o tema escuro está ativado no localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Função para inicializar suporte ao tema escuro
function initDarkModeSupport() {
    // Verificar se o gerenciador de tema existe
    if (!window.themeManager) {
        // Criar gerenciador simples se não existir
        window.themeManager = {
            toggleDarkMode: function(enable) {
                if (enable) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('darkMode', 'disabled');
                }
            },
            isDarkMode: function() {
                return localStorage.getItem('darkMode') === 'enabled';
            }
        };
    }
    
    // Procurar por toggle de tema escuro na página atual
    const darkModeToggle = document.getElementById('darkmode-toggle');
    if (darkModeToggle) {
        // Definir estado inicial do toggle
        darkModeToggle.checked = window.themeManager.isDarkMode();
        
        // Adicionar evento de change para o toggle
        darkModeToggle.addEventListener('change', function() {
            window.themeManager.toggleDarkMode(this.checked);
            updateDarkModeStatus();
        });
        
        // Atualizar ícones e texto
        updateDarkModeStatus();
    }
}

// Função para atualizar ícones e texto do tema escuro
function updateDarkModeStatus() {
    const isDark = window.themeManager.isDarkMode();
    const icon = document.getElementById('darkmode-icon');
    const status = document.getElementById('darkmode-status');
    
    if (icon) {
        if (isDark) {
            icon.className = "fas fa-moon text-purple-600 dark:text-purple-400";
        } else {
            icon.className = "fas fa-sun text-amber-500";
        }
    }
    
    if (status) {
        status.textContent = isDark ? "Ativado" : "Desativado";
        status.className = isDark 
            ? "text-sm font-medium text-green-600 dark:text-green-400" 
            : "text-sm font-medium text-gray-600 dark:text-gray-300";
    }
}

// Função para decodificar JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        console.error('Erro ao decodificar token:', e);
        return null;
    }
} 