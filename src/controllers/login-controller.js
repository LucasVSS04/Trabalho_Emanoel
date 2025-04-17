// Controlador da UI para mostrar/ocultar senha
document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');

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

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBton = document.getElementById('login-bton');
    const forgotBtn = document.getElementById('forgot-btn');
    const registerBtn = document.getElementById('register-btn');
  
    
    // Event Listeners
    loginBton.addEventListener('click', function() {
        // Redirecionar para a página de login
        window.location.href = '/src/views/pin/confirmacao-pin.html';
    });
    
    forgotBtn.addEventListener('click', function() {
          // Redirecionar para a página de cadastro    
          window.location.href = '/src/views/recuperacao-senha/recuperacao-senha.html';
  
    });

    registerBtn.addEventListener('click', function() {
        // Redirecionar para a página de login
        window.location.href = '/src/views/cadastro/cadastro.html';
    });
  });

