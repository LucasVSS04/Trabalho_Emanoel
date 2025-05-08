// Controlador da UI para mostrar/ocultar senha
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.querySelector(".eye-icon");
  const backBtn = document.querySelector(".back-btn"); // Botão de voltar se existir

  if (eyeIcon && passwordInput) {
    eyeIcon.addEventListener("click", function () {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;

      // Alternar os ícones (fa-eye ↔ fa-eye-slash)
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }
  
  // Botão de voltar com transição
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      if (window.pageTransitions) {
        window.pageTransitions.goBack();
      } else {
        window.history.back();
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const loginBton = document.getElementById("login-bton");
  const forgotBtn = document.getElementById("forgot-btn");
  const registerBtn = document.getElementById("register-btn");

  forgotBtn.addEventListener("click", function () {
    // Redirecionar para a página de recuperação de senha com transição
    if (window.pageTransitions) {
      window.pageTransitions.navigateTo("/src/views/recuperacao-senha/recuperacao-senha.html", "slide-right");
    } else {
      window.location.href = "/src/views/recuperacao-senha/recuperacao-senha.html";
    }
  });

  registerBtn.addEventListener("click", function () {
    // Redirecionar para a página de cadastro com transição
    if (window.pageTransitions) {
      window.pageTransitions.navigateTo("/src/views/cadastro/cadastro.html", "slide-right");
    } else {
      window.location.href = "/src/views/cadastro/cadastro.html";
    }
  });
});

document.getElementById("login-bton").addEventListener("click", async () => {
  const email = document.getElementById("username").value;
  const senha = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();
    if (res.ok) {
      sessionStorage.setItem("token", data.token);
      alert("Login realizado com sucesso!");
      
      // Navegar para a próxima página com transição
      if (window.pageTransitions) {
        window.pageTransitions.navigateTo("../pin/confirmacao-pin.html", "flip");
      } else {
        window.location.href = "../pin/confirmacao-pin.html";
      }
    } else {
      alert(data.error || "Erro no login");
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
  }
});
