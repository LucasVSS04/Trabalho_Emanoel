document.addEventListener("DOMContentLoaded", () => {
  const iconeSino = document.querySelector(".icone-sino");

  // Verifica se estamos na página de notificações e ativa o sino
  if (window.location.pathname.includes("notificacao")) {
    iconeSino.classList.add("active");
  }

  // Função para alternar o estado ativo do sino
  function toggleSino() {
    iconeSino.classList.toggle("active");
  }

  // Adiciona o evento de clique ao sino
  iconeSino.addEventListener("click", toggleSino);

  // Função para formatar a data/hora
  function formatarDataHora(data) {
    const agora = new Date();
    const dataNotificacao = new Date(data);
    const diff = agora - dataNotificacao;

    // Se for menos de 24 horas, mostra "há X horas/minutos"
    if (diff < 24 * 60 * 60 * 1000) {
      const horas = Math.floor(diff / (60 * 60 * 1000));
      if (horas === 0) {
        const minutos = Math.floor(diff / (60 * 1000));
        return `há ${minutos} minuto${minutos !== 1 ? "s" : ""}`;
      }
      return `há ${horas} hora${horas !== 1 ? "s" : ""}`;
    }

    // Se for menos de 7 dias, mostra o dia da semana
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const diasSemana = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      return diasSemana[dataNotificacao.getDay()];
    }

    // Caso contrário, mostra a data completa
    return dataNotificacao.toLocaleDateString("pt-BR");
  }

  // Atualiza os horários das notificações
  function atualizarHorarios() {
    const horarios = document.querySelectorAll(".hora");
    horarios.forEach((horario) => {
      const timestamp = horario.getAttribute("data-timestamp");
      if (timestamp) {
        horario.textContent = formatarDataHora(parseInt(timestamp));
      }
    });
  }

  // Atualiza os horários a cada minuto
  setInterval(atualizarHorarios, 60000);
  atualizarHorarios(); // Executa imediatamente na primeira vez

  // Função para obter o cumprimento baseado na hora
  function getCumprimento() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom Dia";
    if (hora >= 12 && hora < 18) return "Boa Tarde";
    return "Boa Noite";
  }

  // Atualiza as informações do usuário
  const token = sessionStorage.getItem("token");
  if (token) {
    const payload = parseJwt(token);
    if (payload?.nome) {
      const nomeUsuario = document.getElementById("nomeUsuario");
      const saudacao = document.getElementById("saudacao");

      if (nomeUsuario && saudacao) {
        nomeUsuario.textContent = payload.nome;
        saudacao.textContent = getCumprimento();
      }
    }
  }
});
