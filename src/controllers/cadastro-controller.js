document.addEventListener('DOMContentLoaded', function () {
    // Alternar visibilidade da senha
    const toggleSenha = document.getElementById('toggle-senha');
    const senhaInput = document.getElementById('senha');
    const confirmarBtn = document.getElementById('confirmar-btn');

    toggleSenha.addEventListener('click', function () {
        const tipo = senhaInput.type === 'password' ? 'text' : 'password';
        senhaInput.type = tipo;
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Alternar visibilidade da confirmação de senha
    const toggleConfirmarSenha = document.getElementById('toggle-confirmar-senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');

    toggleConfirmarSenha.addEventListener('click', function () {
        const tipo = confirmarSenhaInput.type === 'password' ? 'text' : 'password';
        confirmarSenhaInput.type = tipo;
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Exibir data formatada no span (formato brasileiro)
    const dataNascimento = document.getElementById("nascimento");
    const dataFormatada = document.getElementById("data-formatada");

    dataNascimento.addEventListener("change", function () {
        const valorData = this.value;

        if (valorData && valorData.includes("-")) {
            const [ano, mes, dia] = valorData.split("-");
            if (ano && mes && dia) {
                dataFormatada.textContent = `${dia}/${mes}/${ano}`;
            }
        } else {
            dataFormatada.textContent = '';
        }
    });
    confirmarBtn.addEventListener('click', function () {
        // Redirecionar para a página de login
        window.location.href = '/src/views/login/login.html';
    });

});
