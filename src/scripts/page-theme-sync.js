/**
 * Sincronizador de tema entre páginas
 * Mantém o tema escuro consistente durante navegação entre páginas
 */
(function() {
  // Garante que o tema correto é aplicado ao carregar a página
  function applyCurrentTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  // Salva o tema atual antes de navegar para outra página
  function saveThemeBeforeNavigation() {
    // Capturar todos os cliques em links
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        // É um link interno, então salvar o tema atual
        const isDarkMode = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
      }
    });
    
    // Capturar navegação programática
    const originalPushState = history.pushState;
    history.pushState = function() {
      // Salvar tema antes de mudar de página
      const isDarkMode = document.documentElement.classList.contains('dark');
      localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
      
      // Chamar implementação original
      return originalPushState.apply(this, arguments);
    };
  }
  
  // Inicializar
  function init() {
    // Aplicar tema atual
    applyCurrentTheme();
    
    // Configurar persistência de tema durante navegação
    saveThemeBeforeNavigation();
    
    // Escutar alterações de tema vindas de outras páginas
    if (window.BroadcastChannel) {
      const themeChannel = new BroadcastChannel('theme_change');
      themeChannel.onmessage = function(event) {
        if (event.data.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
    }
  }
  
  // Inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 