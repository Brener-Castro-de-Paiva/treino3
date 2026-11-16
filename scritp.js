// ============================================
// Simulação de "banco de dados" com localStorage
// Para integrar banco real: substituir as funções
// salvarAgente / carregarAgentes por chamadas fetch()
// ============================================

const CHAVE = "agentes_cyber";

function carregarAgentes() {
    const dados = localStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
}

function salvarAgente(codinome) {
    const agentes = carregarAgentes();
    agentes.push({
        codinome: codinome,
        registrado_em: new Date().toISOString()
    });
    localStorage.setItem(CHAVE, JSON.stringify(agentes));
}

function renderizarLista() {
    const lista = document.getElementById("lista-agentes");
    lista.innerHTML = "";

    const agentes = carregarAgentes();

    if (agentes.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhum agente registrado ainda...";
        lista.appendChild(li);
        return;
    }

    agentes.forEach(function (a) {
        const li = document.createElement("li");
        li.textContent = a.codinome;
        lista.appendChild(li);
    });
}

// ===== EVENTO DE ENVIO DO FORM =====
document.getElementById("form-portal").addEventListener("submit", function (e) {
    e.preventDefault();

    const codinome = document.getElementById("codinome").value.trim();
    const resposta = document.getElementById("resposta");

    if (codinome === "") {
        resposta.textContent = "⚠️ Digite um codinome válido!";
        resposta.style.color = "#ff0055";
        return;
    }

    // Verificação de duplicata
    const agentes = carregarAgentes();
    const existe = agentes.some(function (a) {
        return a.codinome.toLowerCase() === codinome.toLowerCase();
    });

    if (existe) {
        resposta.textContent = "⚠️ Codinome já registrado!";
        resposta.style.color = "#ff0055";
        return;
    }

    salvarAgente(codinome);

    resposta.textContent = "✅ Agente '" + codinome + "' registrado com sucesso!";
    resposta.style.color = "#00ff9d";

    document.getElementById("codinome").value = "";
    renderizarLista();
});

// ===== INICIALIZA =====
renderizarLista();