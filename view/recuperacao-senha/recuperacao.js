// Controlador da UI para mostrar/ocultar senha
document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('nova-senha'); // ID corrigido
    const eyeIcon = document.getElementById('toggleSenha'); // ID correto do ícone do olho

    if (eyeIcon && passwordInput) {
        eyeIcon.addEventListener("click", function () {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;

            // Alternar os ícones (fa-eye ↔ fa-eye-slash)
            eyeIcon.classList.toggle("fa-eye");
            eyeIcon.classList.toggle("fa-eye-slash");
        });
    }
});
