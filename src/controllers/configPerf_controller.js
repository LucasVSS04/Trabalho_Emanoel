document.addEventListener("DOMContentLoaded", function () {
  // Elementos da DOM
  const backBtn = document.getElementById("back-btn");
  const deleteAccountBtn = document.getElementById("delete-account-btn");
  const notificationToggle = document.getElementById("notifications-toggle");
  const darkModeToggle = document.getElementById("darkmode-toggle");
  const notificationIcon = document.getElementById("notifications-icon");
  const notificationStatus = document.getElementById("notifications-status");
  const darkmodeIcon = document.getElementById("darkmode-icon");
  const darkmodeStatus = document.getElementById("darkmode-status");
  const minimizeBtn = document.querySelector(
    ".material-symbols-outlined:nth-of-type(3)"
  );
  const maximizeBtn = document.querySelector(
    ".material-symbols-outlined:nth-of-type(4)"
  );
  const closeBtn = document.querySelector(
    ".material-symbols-outlined:nth-of-type(5)"
  );

  let token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/src/views/login/login.html";
    return;
  }

  backBtn.addEventListener("click", function () {
    window.location.href = "/src/views/user/user.html";
  });
  // Função para inicializar as configurações
  function initSettings() {
    // Carrega configuração de notificações
    const notificationsEnabled = localStorage.getItem("notificationsEnabled");
    if (notificationsEnabled !== null) {
      notificationToggle.checked = notificationsEnabled === "true";
      updateNotificationIcons();
    }

    // Verificar se o tema escuro está ativo no localStorage e atualizar o toggle
    if (darkModeToggle) {
      // Definir o estado inicial do toggle com base no localStorage
      const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
      darkModeToggle.checked = isDarkMode;
      updateDarkModeIcons();
    }
  }

  // Função para atualizar ícones de notificação
  function updateNotificationIcons() {
    if (!notificationIcon || !notificationStatus) return;

    const isOn = notificationToggle.checked;

    if (isOn) {
      notificationIcon.className = "fas fa-bell text-blue-600";
      notificationStatus.textContent = "Ativado";
      notificationStatus.className = "text-sm font-medium text-green-600";
    } else {
      notificationIcon.className = "fas fa-bell-slash text-gray-500";
      notificationStatus.textContent = "Desativado";
      notificationStatus.className = "text-sm font-medium text-gray-600";
    }
  }

  // Função para atualizar ícones de tema escuro
  function updateDarkModeIcons() {
    if (!darkmodeIcon || !darkmodeStatus) return;

    const isOn = darkModeToggle.checked;

    if (isOn) {
      darkmodeIcon.className = "fas fa-moon text-purple-600";
      darkmodeStatus.textContent = "Ativado";
      darkmodeStatus.className = "text-sm font-medium text-green-600";
    } else {
      darkmodeIcon.className = "fas fa-sun text-amber-500";
      darkmodeStatus.textContent = "Desativado";
      darkmodeStatus.className = "text-sm font-medium text-gray-600";
    }
  }

  // Event Listeners
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      // Usa o gerenciador de transições para voltar de forma fluida
      if (window.pageTransitions) {
        window.pageTransitions.goBack();
      } else {
        window.history.back();
      }
    });
  }

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", function () {
      showDeleteAccountModal();
    });
  }

  if (notificationToggle) {
    notificationToggle.addEventListener("change", function () {
      localStorage.setItem("notificationsEnabled", this.checked);
      updateNotificationIcons();
      showToast(`Notificações ${this.checked ? "ativadas" : "desativadas"}`);
    });
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      // Implementação direta do modo escuro
      if (this.checked) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'disabled');
      }
      
      // Se o gerenciador de tema estiver disponível, use-o também
      if (window.themeManager) {
        window.themeManager.toggleDarkMode(this.checked);
      }
      
      updateDarkModeIcons();
      showToast(`Tema escuro ${this.checked ? "ativado" : "desativado"}`);
    });
  }

  // Funções de controle de janela (simulação)
  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", function () {
      showToast("Minimizar janela");
    });
  }

  if (maximizeBtn) {
    maximizeBtn.addEventListener("click", function () {
      showToast("Maximizar janela");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      if (window.confirm("Deseja realmente sair?")) {
        // Usa transição para voltar à página inicial
        if (window.pageTransitions) {
          window.pageTransitions.navigateTo("../../index.html", "fade");
        } else {
          window.location.href = "../../index.html";
        }
      }
    });
  }

  // Função para excluir usuário do banco de dados
  async function deleteUserFromDatabase(userId) {
    try {
      showToast("Excluindo conta...");

      // Obter o ID do usuário do token
      const userToken = sessionStorage.getItem("token");
      if (!userToken) {
        throw new Error("Usuário não autenticado");
      }

      // Se userId não for passado, tenta extrair do token (depende da implementação do seu token)
      if (!userId) {
        // Tenta obter o ID do usuário da sessão
        userId = sessionStorage.getItem("userId");
        if (!userId) {
          throw new Error("ID do usuário não encontrado");
        }
      }

      // 1. Excluir registros relacionados da tabela relatorio_transacao
      // Primeiro, precisamos encontrar todas as transações do usuário
      const transacaoResponse = await fetch(
        `http://localhost:3000/api/transacoes/usuario/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!transacaoResponse.ok) {
        throw new Error("Erro ao buscar transações do usuário");
      }

      const transacoes = await transacaoResponse.json();

      // Para cada transação, excluir registros relacionados em relatorio_transacao
      for (const transacao of transacoes) {
        await fetch(
          `http://localhost:3000/api/relatorio-transacao/transacao/${transacao.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // 2. Excluir todas as transações do usuário
      await fetch(`http://localhost:3000/api/transacoes/usuario/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      // 3. Excluir registros da tabela notificacao_usuario
      await fetch(
        `http://localhost:3000/api/notificacao-usuario/usuario/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 4. Finalmente, excluir o usuário
      const deleteResponse = await fetch(
        `http://localhost:3000/api/usuarios/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!deleteResponse.ok) {
        throw new Error("Erro ao excluir usuário");
      }

      return true;
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      showToast("Erro ao excluir conta: " + error.message);
      return false;
    }
  }

  // Mostra modal de confirmação para deletar conta
  function showDeleteAccountModal() {
    const modal = `
            <div id="delete-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 class="text-xl font-bold text-[#173e3a] mb-4">Confirmar exclusão</h3>
                    <p class="text-gray-600 mb-6">Tem certeza que deseja deletar sua conta permanentemente? Esta ação não pode ser desfeita.</p>
                    <div class="flex justify-end space-x-4">
                        <button id="cancel-delete" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Cancelar</button>
                        <button id="confirm-delete" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Deletar</button>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modal);

    document
      .getElementById("cancel-delete")
      .addEventListener("click", function () {
        document.getElementById("delete-modal").remove();
      });

    document
      .getElementById("confirm-delete")
      .addEventListener("click", async function () {
        document.getElementById("confirm-delete").disabled = true;
        document.getElementById("confirm-delete").textContent = "Excluindo...";

        // Deleta o usuário do banco de dados
        const deleted = await deleteUserFromDatabase();

        if (deleted) {
          // Limpa dados de autenticação local
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userId");
          localStorage.removeItem("userToken");

          showToast("Conta deletada com sucesso");

          // Usa transição personalizada para voltar à página inicial após deletar a conta
          setTimeout(() => {
            if (window.pageTransitions) {
              window.pageTransitions.navigateTo("../../index.html", "fade");
            } else {
              window.location.href = "../../index.html";
            }
          }, 1500);
        } else {
          document.getElementById("confirm-delete").disabled = false;
          document.getElementById("confirm-delete").textContent = "Deletar";
        }
      });
  }

  // Mostra toast de notificação
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-notification animate-fade-in";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Inicializa as configurações
  initSettings();
});
