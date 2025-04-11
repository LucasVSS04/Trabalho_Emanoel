// Controlador da UI para mostrar/ocultar senha
document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');

    if (eyeIcon && passwordInput) {
        eyeIcon.addEventListener("click", function () {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;

            // Alternar os ícones (fa-eye ↔ fa-eye-slash)
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    }
});
