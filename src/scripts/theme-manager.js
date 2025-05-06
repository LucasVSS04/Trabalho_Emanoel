/**
 * Gerenciador de Tema Global para E-Cofre
 * Aplica o tema escuro a todas as páginas e sincroniza alterações
 */
window.themeManager = {
  // Alternar o tema escuro
  toggleDarkMode: function(enable) {
    if (enable) {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('darkMode', 'enabled');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkMode', 'disabled');
      localStorage.setItem('theme', 'light');
    }
    
    // Transmitir a alteração para outras páginas
    this.broadcastThemeChange(enable);
    
    console.log('Tema alterado:', enable ? 'escuro' : 'claro');
    
    return enable;
  },
  
  // Alternar o modo de alto contraste
  toggleHighContrast: function(enable) {
    if (enable) {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.body.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    }
    
    console.log('Alto contraste:', enable ? 'ativado' : 'desativado');
    
    return enable;
  },
  
  // Verificar se o tema escuro está ativo
  isDarkMode: function() {
    return localStorage.getItem('darkMode') === 'enabled' || 
           localStorage.getItem('theme') === 'dark';
  },
  
  // Verificar se o alto contraste está ativo
  isHighContrast: function() {
    return localStorage.getItem('highContrast') === 'true';
  },
  
  // Transmitir alteração de tema para outras abas/janelas
  broadcastThemeChange: function(isDark) {
    if (window.BroadcastChannel) {
      const themeChannel = new BroadcastChannel('theme_change');
      themeChannel.postMessage({ 
        isDark,
        highContrast: this.isHighContrast()
      });
    }
  },
  
  // Salvar preferências de tema
  savePreferences: function() {
    const isDark = this.isDarkMode();
    const isHighContrast = this.isHighContrast();
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    localStorage.setItem('highContrast', isHighContrast.toString());
    
    return { isDark, isHighContrast };
  },
  
  // Resetar preferências para os padrões do sistema
  resetPreferences: function() {
    localStorage.removeItem('theme');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('highContrast');
    
    // Usar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.toggleDarkMode(prefersDark);
    this.toggleHighContrast(false);
    
    return {
      isDark: prefersDark,
      isHighContrast: false
    };
  },
  
  // Obter estado atual do tema
  getThemeState: function() {
    return {
      isDark: this.isDarkMode(),
      isHighContrast: this.isHighContrast()
    };
  },
  
  // Inicializar o gerenciador de tema
  init: function() {
    // Aplicar tema atual com base no localStorage
    const isDark = this.isDarkMode();
    const isHighContrast = this.isHighContrast();
    
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
    
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
    }
    
    // Adicionar detector de alterações de tema de outras abas
    if (window.BroadcastChannel) {
      const themeChannel = new BroadcastChannel('theme_change');
      themeChannel.onmessage = (event) => {
        if (event.data.isDark) {
          document.documentElement.classList.add('dark-theme');
          document.body.classList.add('dark-theme');
        } else {
          document.documentElement.classList.remove('dark-theme');
          document.body.classList.remove('dark-theme');
        }
        
        if (event.data.highContrast) {
          document.documentElement.classList.add('high-contrast');
          document.body.classList.add('high-contrast');
        } else {
          document.documentElement.classList.remove('high-contrast');
          document.body.classList.remove('high-contrast');
        }
      };
    }
    
    // Adicionar detector de mudança de preferência do sistema
    if (window.matchMedia) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Verificar se o usuário não escolheu uma preferência manual
      if (localStorage.getItem('darkMode') === null && localStorage.getItem('theme') === null) {
        this.toggleDarkMode(darkModeMediaQuery.matches);
      }
      
      // Atualizar se a preferência do sistema mudar
      darkModeMediaQuery.addEventListener('change', (e) => {
        // Só aplica se o usuário não tiver uma preferência manual
        if (localStorage.getItem('darkMode') === null && localStorage.getItem('theme') === null) {
          this.toggleDarkMode(e.matches);
        }
      });
    }
    
    console.log('Theme Manager inicializado. Modo escuro:', isDark ? 'ativado' : 'desativado');
  }
};

// Inicializar o gerenciador de tema o mais cedo possível
// Isso aplica o tema imediatamente, antes mesmo do DOM estar pronto
window.themeManager.init();

// Reaplica quando o DOM estiver totalmente carregado, para atualizar elementos dinâmicos
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se os estilos do tema escuro estão disponíveis
  const darkThemeLink = document.querySelector('link[href*="dark-theme.css"]');
  if (!darkThemeLink) {
    console.log('Adicionando estilos do tema escuro dinamicamente');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/styles/dark-theme.css';
    document.head.appendChild(link);
  }
}); 