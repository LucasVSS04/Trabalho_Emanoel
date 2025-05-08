/**
 * Browser-based Dark Theme Application Script
 * 
 * This script can be run directly in the browser console to apply dark theme
 * without needing to modify the HTML directly.
 */
(function() {
  // Prevent duplicate loading
  if (document.getElementById('dark-theme-style')) {
    console.log('Dark theme already initialized');
    return;
  }

  // Create theme manager
  const themeManager = {
    isDarkMode: false,
    
    // Toggle dark mode and return new state
    toggleDarkMode: function() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
      return this.isDarkMode;
    },
    
    // Get current dark mode state
    getDarkMode: function() {
      return this.isDarkMode;
    },
    
    // Apply the current theme
    applyTheme: function() {
      document.documentElement.classList.toggle('dark', this.isDarkMode);
      this.applyToElements();
    },
    
    // Apply theme to elements
    applyToElements: function() {
      const elements = document.querySelectorAll(commonSelectors.join(', '));
      elements.forEach(el => {
        if (this.isDarkMode) {
          el.classList.add('dark-theme');
          
          // Replace light classes with dark classes
          if (el.classList.contains('bg-light') || el.classList.contains('bg-white')) {
            el.classList.remove('bg-light', 'bg-white');
            el.classList.add('dark-theme-bg');
          }
          
          if (el.classList.contains('text-dark')) {
            el.classList.remove('text-dark');
            el.classList.add('dark-theme-text');
          }
        } else {
          el.classList.remove('dark-theme', 'dark-theme-bg', 'dark-theme-text');
          
          // Restore original classes based on data attributes if available
          if (el.dataset.originalBg) {
            el.classList.add(el.dataset.originalBg);
          }
          
          if (el.dataset.originalText) {
            el.classList.add(el.dataset.originalText);
          }
        }
      });
      
      // Apply specific page adjustments based on URL path
      this.applySpecificPageAdjustments();
    },
    
    // Apply specific adjustments based on the current page
    applySpecificPageAdjustments: function() {
      const path = window.location.pathname;
      
      // Home page adjustments
      if (path === '/' || path.includes('/home')) {
        this.applyHomePageAdjustments();
      }
      
      // Transactions page adjustments
      if (path.includes('/transactions')) {
        this.applyTransactionsPageAdjustments();
      }
    },
    
    // Apply home page specific adjustments
    applyHomePageAdjustments: function() {
      const dashboardCards = document.querySelectorAll('.dashboard-card, .stats-card');
      dashboardCards.forEach(card => {
        if (this.isDarkMode) {
          card.classList.add('dark-theme');
        } else {
          card.classList.remove('dark-theme');
        }
      });
    },
    
    // Apply transactions page specific adjustments
    applyTransactionsPageAdjustments: function() {
      const transactionItems = document.querySelectorAll('.transaction-item, .transaction-row');
      transactionItems.forEach(item => {
        if (this.isDarkMode) {
          item.classList.add('dark-theme');
        } else {
          item.classList.remove('dark-theme');
        }
      });
    }
  };
  
  // Common selectors that need the dark theme class
  const commonSelectors = [
    'body',
    '.container',
    '.card',
    '.card-header',
    '.card-body',
    '.card-footer',
    '.navbar',
    '.sidebar',
    '.main-content',
    '.table',
    '.table thead th',
    '.table tbody td',
    '.modal-content',
    '.modal-header',
    '.modal-body',
    '.modal-footer',
    '.list-group',
    '.list-group-item',
    '.form-control',
    '.dropdown-menu',
    '.dropdown-item',
    '.btn-light',
    '.btn-outline-secondary',
    '.alert',
    '.page-link',
    '.table-head'
  ];

  // Add the dark theme stylesheet
  const linkElement = document.createElement('link');
  linkElement.id = 'dark-theme-style';
  linkElement.rel = 'stylesheet';
  linkElement.href = '/styles/dark-theme.css';
  document.head.appendChild(linkElement);

  // Initialize dark mode (default to false)
  themeManager.isDarkMode = false;
  
  // Check if user has a preference saved in localStorage
  if (localStorage.getItem('darkModeEnabled') === 'true') {
    themeManager.isDarkMode = true;
  }
  
  // Apply the initial theme
  themeManager.applyTheme();
  
  // Add a global variable to allow toggling from console or other scripts
  window.toggleDarkMode = function() {
    const newState = themeManager.toggleDarkMode();
    localStorage.setItem('darkModeEnabled', newState);
    console.log('Dark mode ' + (newState ? 'enabled' : 'disabled'));
    return newState;
  };
  
  // Apply to iframes if possible
  try {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (iframe.contentDocument) {
        iframe.contentDocument.documentElement.classList.toggle('dark', themeManager.isDarkMode);
      }
    });
  } catch (e) {
    console.log('Could not apply dark theme to iframes due to security restrictions');
  }
  
  // Log the number of modified elements
  const modifiedElements = document.querySelectorAll('.dark-theme, .dark-theme-bg, .dark-theme-text').length;
  console.log(`Applied dark theme to ${modifiedElements} elements`);
})(); 