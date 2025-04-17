// Controlador da UI para mostrar/ocultar senha
document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('nova-senha'); // ID corrigido
    const eyeIcon = document.getElementById('toggleSenha'); // ID correto do ícone do olho
    const confirmarBtn = document.getElementById('confirmar-btn');
    const reenviarBtn = document.getElementById('reenviar-btn');

    if (eyeIcon && passwordInput) {
        eyeIcon.addEventListener("click", function () {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;

            // Alternar os ícones (fa-eye ↔ fa-eye-slash)
            eyeIcon.classList.toggle("fa-eye");
            eyeIcon.classList.toggle("fa-eye-slash");
        });
    }

    confirmarBtn.addEventListener('click', function () {
        // Redirecionar para a página de login
        window.location.href = '/src/views/login/login.html';
    })

    reenviarBtn.addEventListener('click', function () {
        // Atualiza a página atual
        window.location.href = '/src/views/recuperacao-senha/recuperacao-senha.html';
    })
});
