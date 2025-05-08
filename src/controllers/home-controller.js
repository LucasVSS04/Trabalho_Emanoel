document.addEventListener('DOMContentLoaded', function () {

    const notification = document.getElementById('notificacao');
    
    const goToDashboard = (periodo) => {
        switch (periodo) {
            case 'dia':
                window.location.href = '/src/views/home/dia/tela_dashboard_dia.html';
                break;
            case 'semana':
                window.location.href = '/src/views/home/semana/tela_dashboard_semana.html';
                break;
            case 'mes':
                window.location.href = '/src//views/home/mes/tela_dashboard_mes.html';
                break;
                
            default:
                console.error('Período não reconhecido!');
        }
    };

    const btns = document.querySelectorAll('[data-periodo]');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const periodo = btn.getAttribute('data-periodo');
            goToDashboard(periodo);
        });
    });

    notification.addEventListener('click', function() {
        // Redirecionar para a página de login
        window.location.href = '/src/views/notificacao/notificacao.html';
    });

    const userBtn = document.getElementById('user');
    
    // Verifica se o botão existe
    if (!userBtn) {
        console.error('Botão de usuário não encontrado!');
        return;
    }

    // Adiciona o event listener para o botão de usuário
    userBtn.addEventListener('click', function(e) {
        window.location.href = '/src/views/user/user.html';
    });

    // Adicionar o event listener para o botão de transações
    const transactionBtn = document.getElementById('transaction');
    if (transactionBtn) {
        transactionBtn.addEventListener('click', function() {
            window.location.href = '/src/views/Transacao/Transacao.html';
        });
    }

});

