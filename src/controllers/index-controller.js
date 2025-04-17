// UI Controller - Handles UI interactions
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');

  
  // Event Listeners
  loginBtn.addEventListener('click', function() {
      // Redirecionar para a página de login
      window.location.href = '/src/views/login/login.html';
  });
  
  registerBtn.addEventListener('click', function() {
        // Redirecionar para a página de cadastro    
        window.location.href = '/src/views/cadastro/cadastro.html';

  });
});