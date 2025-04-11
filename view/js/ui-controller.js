// UI Controller - Handles UI interactions
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const minimizeBtn = document.querySelector('.minimize');
  const maximizeBtn = document.querySelector('.maximize');
  const closeBtn = document.querySelector('.close');
  
  // Event Listeners
  loginBtn.addEventListener('click', function() {
      // Redirecionar para a página de login
      window.location.href = 'login/login.html';
  });
  
  registerBtn.addEventListener('click', function() {
        // Redirecionar para a página de cadastro    
        window.location.href = 'cadastro/cadastro.html';

  });
  
  // Window control buttons
  minimizeBtn.addEventListener('click', function() {
      if (window.electronAPI) {
          window.electronAPI.minimizeWindow();
      } else {
          console.log('Minimize window (não disponível no navegador)');
      }
  });
  
  maximizeBtn.addEventListener('click', function() {
      if (window.electronAPI) {
          window.electronAPI.maximizeWindow();
      } else {
          console.log('Maximize window (não disponível no navegador)');
      }
  });
  
  closeBtn.addEventListener('click', function() {
      if (window.electronAPI) {
          window.electronAPI.closeWindow();
      } else {
          console.log('Close window (não disponível no navegador)');
      }
  });
});