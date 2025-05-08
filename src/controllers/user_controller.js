document.addEventListener("DOMContentLoaded", function () {
  const nameEl = document.getElementById("user-name");
  const usuarioId = document.getElementById("user-id");
  const logoutBtn = document.getElementById("logout-btn");
  const notificationBtn = document.getElementById("notification-btn");
  const configBtn = document.getElementById("config-btn");
  const securityBtn = document.getElementById("security-btn");
  const editProfileCard = document.querySelector(".option-card:nth-child(1)"); // First option card is Edit Profile
  const analiseBtn = document.getElementById('analise');

  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("Usuário não autenticado");
    // Redirecionar para a página de login se não houver token
    window.location.href = "/src/views/login/login.html";
    return;
  }

  document.body.style.display = "block";

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
      return null;
    }
  }

  async function loadUserInfo() {
    try {

      const userData = parseJwt(token);

      if (!userData) {
        console.error("Token inválido ou expirado");
        window.location.href = "/src/views/login/login.html";
        return;
      }

      if (nameEl) nameEl.textContent = userData.nome;
      if (usuarioId) usuarioId.textContent = `ID: ${userData.id}`;
      sessionStorage.setItem("userId", userData.id);

    } catch (error) {
      console.error("Erro ao carregar informações do usuário:", error);
      // Exibe um nome genérico em caso de erro
      if (nameEl) nameEl.textContent = "Usuário";
      if (roleEl) roleEl.textContent = "ID: N/A";
    }
  }

  function setupNavigation() {
    const pages = {
      home: "/src/views/home/dia/tela_dashboard_dia.html",
      transaction: "/src/views/transaction/transaction.html",
      user: "/src/views/user/user.html",
      analytics: "/src/views/analise/analise.html",
    };

    Object.entries(pages).forEach(([id, path]) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", () => {
          if (window.pageTransitions) {
            window.pageTransitions.navigateTo(path, "slide-right");
          } else {
            window.location.href = path;
          }
        });
      }
    });

    if (notificationBtn) {
      notificationBtn.addEventListener("click", () => {
        if (window.pageTransitions) {
          window.pageTransitions.navigateTo(
            "/src/views/notificacao/notificacao.html",
            "slide-right"
          );
        } else {
          window.location.href = "/src/views/notificacao/notificacao.html";
        }
      });
    }

    if (configBtn) {
      configBtn.addEventListener("click", () => {
        if (window.pageTransitions) {
          window.pageTransitions.navigateTo(
            "/src/views/Config-perf/config.html",
            "slide-right"
          );
        } else {
          window.location.href = "/src/views/Config-perf/config.html";
        }
      });
    }

    if (editProfileCard) {
      editProfileCard.addEventListener("click", () => {
        if (window.pageTransitions) {
          window.pageTransitions.navigateTo(
            "/src/views/editarPerfil/editPerf.html",
            "slide-right"
          );
        } else {
          window.location.href = "/src/views/editarPerfil/editPerf.html";
        }
      });
    }

    if (securityBtn) {
      securityBtn.addEventListener("click", () => {
        if (window.pageTransitions) {
          window.pageTransitions.navigateTo(
            "/src/views/security/security.html",
            "slide-right"
          );
        } else {
          window.location.href = "/src/views/security/security.html";
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Limpar dados de autenticação
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");

        if (window.pageTransitions) {
          window.pageTransitions.navigateTo(
            "/src/views/login/login.html",
            "fade"
          );
        } else {
          window.location.href = "/src/views/login/login.html";
        }
      });
    }

    if (analiseBtn) {
      analiseBtn.addEventListener('click', () => {
        window.location.href = '/src/views/analise/analise.html';
      });
    }
  }

  loadUserInfo();
  setupNavigation();
});
