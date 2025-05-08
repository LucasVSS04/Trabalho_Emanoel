document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de alteração de senha carregada');
    
    // Elementos do DOM
    const form = document.getElementById('change-password-form');
    const backBtn = document.getElementById('back-btn');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    // Verificar autenticação
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.log('Nenhum token encontrado, redirecionando para login');
        showToast('Você precisa estar autenticado para acessar esta página', 'error');
        setTimeout(() => {
            window.location.href = '/src/views/login/login.html';
        }, 2000);
        return;
    }
    
    // Parse JWT token para obter informações do usuário
    function parseJwt(token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Erro ao decodificar token:', e);
            return null;
        }
    }
    
    // Inicializar e verificar tema escuro
    checkDarkMode();
    
    // Botão voltar
    backBtn.addEventListener('click', () => {
        console.log('Botão voltar clicado');
        window.location.href = '/src/views/security/security.html';
    });
    
    // Toggle de visibilidade das senhas
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('span');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility';
                console.log('Senha mostrada');
            } else {
                input.type = 'password';
                icon.textContent = 'visibility_off';
                console.log('Senha ocultada');
            }
        });
    });
    
    // Validação e envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Formulário de alteração de senha submetido');
        
        const senhaAntiga = document.getElementById('senha-antiga').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        
        // Validações básicas
        if (!senhaAntiga || !novaSenha || !confirmarSenha) {
            console.log('Campos obrigatórios faltando');
            showToast('Todos os campos são obrigatórios', 'error');
            return;
        }
        
        if (novaSenha !== confirmarSenha) {
            console.log('Senhas não coincidem');
            showToast('As senhas não coincidem', 'error');
            return;
        }
        
        if (novaSenha.length < 6) {
            console.log('Senha muito curta');
            showToast('A nova senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }
        
        // Adiciona efeito de loading no botão
        const submitBtn = this.querySelector('button[type="submit"]');
        const btnText = submitBtn.innerHTML;
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = '<span>' + btnText + '</span>';
        submitBtn.disabled = true;
        
        try {
            // Obter dados do usuário a partir do token
            const userData = parseJwt(token);
            if (!userData || !userData.id) {
                console.log('Token inválido ou sem ID de usuário');
                showToast('Usuário inválido ou token expirado', 'error');
                return;
            }
            
            console.log('Enviando requisição PATCH para alterar senha...');
            
            const response = await fetch(
                `http://localhost:3000/api/usuarios/${userData.id}/change-password`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        senhaAtual: senhaAntiga,
                        novaSenha: novaSenha
                    })
                }
            );
            
            const data = await response.json();
            console.log('Resposta da API:', { status: response.status, data });
            
            if (response.ok) {
                console.log('Senha alterada com sucesso');
                showToast('Senha alterada com sucesso!', 'success');
                
                // Atualizar o token se a API retornou um novo
                if (data.token) {
                    sessionStorage.setItem('token', data.token);
                    console.log('Token atualizado no sessionStorage');
                }
                
                // Registrar notificação
                try {
                    console.log('Enviando notificação...');
                    await fetch("/api/notificacoes", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            mensagem: "Sua senha foi alterada com sucesso.",
                            data_envio: new Date().toISOString().split('T')[0],
                            id_usuario: userData.id
                        })
                    });
                } catch (notifError) {
                    console.error("Erro ao registrar notificação:", notifError);
                }
                
                // Redirecionar após 2 segundos
                setTimeout(() => {
                    console.log('Redirecionando para página de segurança...');
                    window.location.href = '/src/views/security/security.html';
                }, 2000);
            } else {
                console.log('Erro na resposta da API:', data.error);
                if (data.error === 'Senha atual incorreta' || data.error === 'senha_incorreta') {
                    showToast('A senha atual está incorreta', 'error');
                } else {
                    showToast(data.error || 'Falha ao alterar a senha', 'error');
                }
            }
        } catch (error) {
            console.error('Erro na requisição:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            showToast('Erro ao conectar com o servidor', 'error');
        } finally {
            // Restaurar botão
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = btnText;
            submitBtn.disabled = false;
            console.log('Estado do botão restaurado');
        }
    });
    
    // Função para mostrar notificações
    function showToast(message, type = 'info') {
        console.log(`Exibindo toast: ${type} - ${message}`);
        // Remover toasts existentes
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Criar novo toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Verificar se o tema escuro está ativo
    function checkDarkMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        console.log(`Verificando tema escuro: ${isDarkMode ? 'ativado' : 'desativado'}`);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }
});