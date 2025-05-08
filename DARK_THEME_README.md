# Sistema de Tema Escuro

Este projeto inclui um sistema completo de tema escuro que funciona em todas as páginas. Abaixo estão as instruções de uso e personalização.

## Componentes do Sistema

- **theme-manager.js**: Gerenciador central que controla a funcionalidade do tema escuro
- **dark-theme.css**: Estilos CSS específicos para o tema escuro
- **sidebar.js**: Integração do controle de tema no sidebar da aplicação
- **apply-dark-theme-browser.js**: Script para aplicar o tema escuro diretamente no navegador

## Como Usar

### Uso Automático
O tema escuro já está configurado para funcionar automaticamente em todas as páginas que incluem o sidebar. O sistema:

1. Verifica a preferência do usuário salva no `localStorage`
2. Aplica o tema escuro na inicialização, se estiver ativado
3. Sincroniza o estado do tema entre todas as abas/páginas abertas
4. Persiste a configuração entre sessões

### Aplicação Manual

Se você precisar aplicar manualmente o tema escuro a uma página específica que não inclui automaticamente:

1. Adicione os seguintes elementos ao `<head>` da página:

```html
<link rel="stylesheet" href="/src/styles/dark-theme.css">
<script src="/src/scripts/theme-manager.js"></script>
```

2. Adicione esta linha ao final do `<body>`:

```html
<script>
  // Verificar e aplicar tema escuro se estiver ativado
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.documentElement.classList.add('dark');
  }
</script>
```

### Aplicação via Console do Navegador

Para páginas que precisam ter o tema escuro aplicado temporariamente durante o desenvolvimento:

1. Abra o console do navegador (F12)
2. Copie e cole todo o conteúdo do arquivo `apply-dark-theme-browser.js`
3. Pressione Enter para executar

## Personalização

### Modificar Estilos do Tema Escuro

Edite o arquivo `src/styles/dark-theme.css` para personalizar as cores e estilos do tema escuro:

```css
/* Exemplo de personalização */
.dark .algum-elemento {
  background-color: #1e1e1e;
  color: #f0f0f0;
}
```

### Adicionar Suporte a Novos Componentes

Para componentes que precisam de estilos específicos no tema escuro:

1. Use classes Tailwind com prefixo `dark:` nos elementos HTML:

```html
<div class="bg-white text-black dark:bg-gray-800 dark:text-white">
  Conteúdo com suporte a tema escuro
</div>
```

2. Ou adicione regras CSS específicas em `dark-theme.css`:

```css
.dark .seu-componente {
  /* Estilos para o tema escuro */
}
```

## Depuração

Se o tema escuro não estiver funcionando corretamente:

1. Verifique se `document.documentElement` tem a classe `dark` quando o tema escuro está ativado
2. Confirme que o localStorage tem a chave `darkMode` com valor `enabled`
3. Verifique se `dark-theme.css` está sendo carregado corretamente
4. Certifique-se de que os componentes têm classes `dark:` apropriadas

---

Para mais informações ou assistência, consulte os comentários nos arquivos de código ou entre em contato com a equipe de desenvolvimento. 