// Função para decodificar JWT
function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}

async function buscarDadosAnalise(periodo) {
    const token = sessionStorage.getItem("token");
    if (!token) {
        window.location.href = "/src/views/login/login.html";
        return;
    }
    const user = parseJwt(token);
    if (!user?.id) return;
    let url = "";
    switch (periodo) {
        case "dia":
            url = `http://localhost:3000/api/transacoes/dia/${user.id}`;
            break;
        case "semana":
            url = `http://localhost:3000/api/transacoes/semana/${user.id}`;
            break;
        case "mes":
            url = `http://localhost:3000/api/transacoes/mes/${user.id}`;
            break;
        case "ano":
            url = `http://localhost:3000/api/transacoes/${user.id}`;
            break;
    }
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    return { periodo, data };
}

// Função para processar os dados recebidos da API para o gráfico
function processarDados(periodo, data) {
    let labels = [];
    let renda = [];
    let despesas = [];
    if (periodo === "dia") {
        // Apenas um dia
        labels = ["Hoje"];
        renda = [data.receitaDoDia || 0];
        despesas = [Math.abs(data.despesasDoDia || 0)];
    } else if (periodo === "semana") {
        // Agrupar por dia da semana
        labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
        renda = Array(7).fill(0);
        despesas = Array(7).fill(0);
        (data.transacoes || []).forEach(t => {
            const d = new Date(t.data);
            const diaSemana = d.getDay();
            if (t.valor > 0) renda[diaSemana] += t.valor;
            else despesas[diaSemana] += Math.abs(t.valor);
        });
    } else if (periodo === "mes") {
        // Agrupar por dia do mês
        const diasNoMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        labels = Array.from({length: diasNoMes}, (_, i) => (i+1).toString());
        renda = Array(diasNoMes).fill(0);
        despesas = Array(diasNoMes).fill(0);
        (data.transacoes || []).forEach(t => {
            const d = new Date(t.data);
            const dia = d.getDate() - 1;
            if (t.valor > 0) renda[dia] += t.valor;
            else despesas[dia] += Math.abs(t.valor);
        });
    } else if (periodo === "ano") {
        // Agrupar por mês
        labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        renda = Array(12).fill(0);
        despesas = Array(12).fill(0);
        (data.transacoes || []).forEach(t => {
            const d = new Date(t.data);
            const mes = d.getMonth();
            if (t.valor > 0) renda[mes] += t.valor;
            else despesas[mes] += Math.abs(t.valor);
        });
    }
    return { labels, renda, despesas };
}

// Inicialização do gráfico
let grafico;
async function atualizarGrafico(periodo) {
    const ctx = document.getElementById("grafico-analise").getContext("2d");
    const resultado = await buscarDadosAnalise(periodo);
    if (!resultado) return;
    const dados = processarDados(periodo, resultado.data);
    if (grafico) grafico.destroy();
    grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: dados.labels,
            datasets: [
                {
                    label: "Renda",
                    data: dados.renda,
                    backgroundColor: "#00cc88",
                },
                {
                    label: "Despesas",
                    data: dados.despesas,
                    backgroundColor: "#007bff",
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
    // Atualizar totais
    const totalRenda = dados.renda.reduce((a, b) => a + b, 0);
    const totalDespesas = dados.despesas.reduce((a, b) => a + b, 0);
    document.getElementById("total-renda").textContent = totalRenda.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    document.getElementById("total-despesas").textContent = totalDespesas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Alternar abas
const tabs = document.querySelectorAll(".tab-btn");
tabs.forEach(tab => {
    tab.addEventListener("click", function() {
        document.querySelector(".tab-btn.ativo").classList.remove("ativo");
        this.classList.add("ativo");
        atualizarGrafico(this.dataset.periodo);
    });
});

// Carregar Chart.js dinamicamente
(function loadChartJs() {
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => atualizarGrafico('dia');
        document.head.appendChild(script);
    } else {
        atualizarGrafico('dia');
    }
})(); 