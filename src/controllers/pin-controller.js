document.addEventListener('DOMContentLoaded', function () {

    const confirmarBtn = document.getElementById('confirmar-btn');
    const reenviarBtn = document.getElementById('reenviar-btn');

    confirmarBtn.addEventListener('click', function () {

        window.location.href = '/src/views/home/mes/tela_dashboard_mes.html';
    });

    reenviarBtn.addEventListener('click', function () {

        window.location.href = '/src/views/pin/confirmacao-pin.html';
    });


});