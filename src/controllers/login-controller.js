// Controlador da UI para mostrar/ocultar senha
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.querySelector(".eye-icon");

  if (eyeIcon && passwordInput) {
    eyeIcon.addEventListener("click", function () {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;

      // Alternar os ícones (fa-eye ↔ fa-eye-slash)
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const loginBton = document.getElementById("login-bton");
  const forgotBtn = document.getElementById("forgot-btn");
  const registerBtn = document.getElementById("register-btn");

  forgotBtn.addEventListener("click", function () {
    // Redirecionar para a página de cadastro
    window.location.href =
      "/src/views/recuperacao-senha/recuperacao-senha.html";
  });

  registerBtn.addEventListener("click", function () {
    // Redirecionar para a página de login
    window.location.href = "/src/views/cadastro/cadastro.html";
  });
});

document.getElementById("login-bton").addEventListener("click", async () => {
  const email = document.getElementById("username").value;
  const senha = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await res.json();
  if (res.ok) {
    sessionStorage.setItem("token", data.token);
    alert("Login realizado com sucesso!");
    window.location.href = "../pin/confirmacao-pin.html"; // ou qualquer próxima página
  } else {
    alert(data.error || "Erro no login");
  }
});
