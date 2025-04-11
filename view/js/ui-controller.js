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
      // Preparar para o registro
      AppLogic.prepareRegistration();
      // Redirecionar para a página de registro (quando criada)
      console.log('Redirecionando para a página de registro...');
      // window.location.href = 'register/register.html';
      
      // Por enquanto, ainda estamos usando o exemplo simulado
      const username = prompt('Digite seu nome:');
      const email = prompt('Digite seu email:');
      const password = prompt('Digite sua senha:');
      
      if (username && email && password) {
          AppLogic.registerUser({
              username: username,
              email: email,
              password: password,
              tipo: 'comum'
          }).then(result => {
              if (result.success) {
                  console.log('Registro bem-sucedido:', result.userData);
                  alert('Conta criada com sucesso!');
                  // Redirecionar para a página de login após registro bem-sucedido
                  window.location.href = 'login/login.html';
              } else {
                  console.error('Falha no registro:', result.message);
                  alert('Falha no registro: ' + result.message);
              }
          }).catch(error => {
              console.error('Erro durante o registro:', error);
              alert('Ocorreu um erro ao tentar criar a conta');
          });
      }
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