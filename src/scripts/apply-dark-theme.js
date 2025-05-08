/**
 * Script para adicionar suporte ao tema escuro em todos os arquivos HTML
 * Execute-o com Node.js: node apply-dark-theme.js
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

// Caminho base do projeto
const baseDir = path.join(__dirname, '../..');

// Referências a serem adicionadas no <head>
const themeManagerRef = `<!-- Tema escuro -->
<script src="/src/scripts/theme-manager.js"></script>
<link rel="stylesheet" href="/src/styles/dark-theme.css">
<script>
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.documentElement.classList.add('dark');
  }
</script>
`;

// Encontrar todos os arquivos HTML recursivamente
async function findHtmlFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subFiles = await findHtmlFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Verificar se o arquivo já tem a referência ao tema
async function hasThemeReference(filePath) {
  const content = await readFile(filePath, 'utf8');
  return content.includes('/src/scripts/theme-manager.js') || 
         content.includes('/src/styles/dark-theme.css');
}

// Adicionar referências ao tema escuro no <head>
async function addThemeReference(filePath) {
  const content = await readFile(filePath, 'utf8');
  
  if (await hasThemeReference(filePath)) {
    console.log(`✓ ${filePath} (já tem o tema escuro)`);
    return;
  }
  
  // Encontrar a posição do </head>
  const headEndPos = content.indexOf('</head>');
  if (headEndPos === -1) {
    console.log(`✗ ${filePath} (não encontrou </head>)`);
    return;
  }
  
  // Inserir referências antes do </head>
  const newContent = content.slice(0, headEndPos) + 
                     themeManagerRef + 
                     content.slice(headEndPos);
  
  await writeFile(filePath, newContent, 'utf8');
  console.log(`✓ ${filePath} (tema escuro adicionado)`);
}

// Adicionar classes dark: a elementos comuns
async function addDarkClasses(filePath) {
  let content = await readFile(filePath, 'utf8');
  
  // Adicionar classes dark: para elementos comuns
  content = content.replace(/class="([^"]*)bg-\[#f2fcf9\]([^"]*)"/g, 'class="$1bg-[#f2fcf9] dark:bg-gray-900$2"');
  content = content.replace(/class="([^"]*)text-\[#173e3a\]([^"]*)"/g, 'class="$1text-[#173e3a] dark:text-white$2"');
  content = content.replace(/class="([^"]*)bg-white([^"]*)"/g, 'class="$1bg-white dark:bg-gray-800$2"');
  
  await writeFile(filePath, content, 'utf8');
}

// Função principal
async function main() {
  try {
    console.log('Procurando arquivos HTML...');
    const htmlFiles = await findHtmlFiles(path.join(baseDir, 'src'));
    console.log(`Encontrados ${htmlFiles.length} arquivos HTML.`);
    
    console.log('\nAdicionando suporte ao tema escuro...');
    for (const file of htmlFiles) {
      await addThemeReference(file);
      await addDarkClasses(file);
    }
    
    console.log('\nConcluído! Todos os arquivos HTML agora suportam o tema escuro.');
    console.log('Para personalizar o tema escuro, edite src/styles/dark-theme.css');
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Executar o script
main(); 