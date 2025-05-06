document.addEventListener("DOMContentLoaded", function() {
  // Botões principais
  const backBtn = document.getElementById("back-btn");
  
  // Opções de segurança
  const changePasswordBtn = document.getElementById("change-password");
  const termsConditionsBtn = document.getElementById("terms-conditions");
  
  // Modais
  const passwordModal = document.getElementById("password-modal");
  const termsModal = document.getElementById("terms-modal");
  const closeModalBtns = document.querySelectorAll(".close-modal");
  const acceptTermsBtn = document.querySelector(".accept-btn");
  
  // Formulário de senha
  const passwordForm = document.getElementById("password-form");
  
  // Toggle de senha nos campos
  const togglePasswordBtns = document.querySelectorAll(".toggle-password");
  
  // Inicializar as transições de página se disponíveis
  const pageTransitions = window.pageTransitions || {
    navigateTo: (url) => window.location.href = url,
    goBack: () => window.history.back()
  };
  
  // Adicionar animação de fade-in ao carregar a página
  document.querySelector('.max-w-xl').classList.add('animate-fade-in');
  
  // Botão voltar
  backBtn?.addEventListener("click", function() {
    window.location.href = "/src/views/user/user.html";
  });

  // Mostrar modais
  changePasswordBtn?.addEventListener("click", function() {
    // Redirecionar para a nova página de troca de senha
    window.location.href = "change-password.html";
  });
  
  termsConditionsBtn?.addEventListener("click", function() {
    termsModal.style.display = "flex";
  });

  // Fechar modais
  closeModalBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const modal = this.closest('.modal');
      modal.classList.add('animate-fade-out');
      
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove('animate-fade-out');
      }, 300);
    });
  });

  // Aceitar termos e condições
  acceptTermsBtn?.addEventListener("click", function() {
    showToast("Termos e condições aceitos!");
    
    const modal = this.closest('.modal');
    modal.classList.add('animate-fade-out');
    
    setTimeout(() => {
      modal.style.display = "none";
      modal.classList.remove('animate-fade-out');
    }, 300);
  });

  // Fechar modal ao clicar fora do conteúdo
  window.addEventListener("click", function(event) {
    if (event.target.classList.contains('modal')) {
      const modal = event.target;
      modal.classList.add('animate-fade-out');
      
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove('animate-fade-out');
      }, 300);
    }
  });

  // Toggle para mostrar/ocultar senha
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const passwordInput = this.previousElementSibling;
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      
      // Alternar os ícones
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  });

  // Função para mostrar mensagens toast
  function showToast(message) {
    // Remover toasts existentes
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    // Criar um novo toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification animate-fade-in';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
      toast.classList.replace('animate-fade-in', 'animate-fade-out');
      
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // Envio do formulário de alteração de senha
  passwordForm?.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    // Validação básica
    if (newPassword !== confirmPassword) {
      showToast("As senhas não coincidem!");
      return;
    }
    
    // Validação de força da senha
    if (newPassword.length < 8) {
      showToast("A senha deve ter pelo menos 8 caracteres!");
      return;
    }
    
    try {
      // Obter o token e ID do usuário
      const token = sessionStorage.getItem("token");
      const usuarioId = sessionStorage.getItem("userId");
      
      if (!token || !usuarioId) {
        showToast("Você precisa estar autenticado para alterar sua senha.");
        return;
      }
      
      // Mostrar indicador de carregamento
      const submitBtn = passwordForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processando...';
      submitBtn.disabled = true;
      
      // Chamar API para alterar senha diretamente no banco de dados
      const response = await fetch("http://localhost:3000/api/usuarios/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: usuarioId,
          senhaAtual: currentPassword,
          novaSenha: newPassword
        })
      });
      
      // Restaurar botão
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      
      if (response.ok) {
        showToast("Senha alterada com sucesso!");
        
        // Registrar na tabela de notificação que houve alteração de senha
        try {
          await fetch("http://localhost:3000/api/notificacoes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              mensagem: "Sua senha foi alterada com sucesso.",
              data_envio: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
              id_usuario: usuarioId
            })
          });
        } catch (notifError) {
          console.error("Erro ao registrar notificação:", notifError);
          // Não vamos interromper o fluxo principal em caso de erro na notificação
        }
        
        const modal = passwordModal;
        modal.classList.add('animate-fade-out');
        
        setTimeout(() => {
          modal.style.display = "none";
          modal.classList.remove('animate-fade-out');
          passwordForm.reset();
        }, 300);
      } else {
        const data = await response.json();
        if (data.error === "senha_incorreta") {
          showToast("Senha atual incorreta. Por favor, verifique.");
        } else {
          showToast(data.error || "Falha ao alterar a senha. Tente novamente mais tarde.");
        }
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      showToast("Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.");
    }
  });

  // Verificar se o tema escuro está ativado
  function checkDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }
  
  // Verificar tema escuro ao carregar
  checkDarkMode();
});
