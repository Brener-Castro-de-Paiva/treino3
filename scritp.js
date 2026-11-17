// 1. Configurar o cliente Supabase
const SUPABASE_URL = 'https://jmxtodoxnwoebsjtluld.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YDupmBrVEm6i00kIkodNqA_gfNxOKq_';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Função para carregar os agentes do banco
async function carregarAgentes() {
    const { data, error } = await _supabase
        .from('agentes')
        .select('codinome')
        .order('registrado_em', { ascending: false });

    if (error) {
        console.error('Erro ao carregar:', error);
        return [];
    }
    
    // Transforma a lista de objetos em uma lista de strings (só os codinomes)
    return data.map(a => a.codinome);
}

// 3. Função para salvar um novo agente
async function salvarAgente(codinome) {
    const { error } = await _supabase
        .from('agentes')
        .insert([{ codinome: codinome }]);

    if (error) {
        console.error('Erro ao salvar:', error);
        throw error; // Repassa o erro para o formulário avisar o usuário
    }
}

// 4. Renderizar a lista na tela
async function renderizarLista() {
    const lista = document.getElementById("lista-agentes");
    lista.innerHTML = ""; // Limpa a lista atual
    
    const agentes = await carregarAgentes();

    if (agentes.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhum agente registrado ainda...";
        lista.appendChild(li);
        return;
    }

    agentes.forEach(function (codinome) {
        const li = document.createElement("li");
        li.textContent = codinome;
        lista.appendChild(li);
    });
}

// 5. Evento de envio do formulário
document.getElementById("form-portal").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const input = document.getElementById("codinome");
    const codinome = input.value.trim();
    const resposta = document.getElementById("resposta");

    if (codinome === "") {
        resposta.textContent = "⚠️ Digite um codinome válido!";
        resposta.style.color = "#ff0055";
        return;
    }

    try {
        // Tenta salvar no banco
        await salvarAgente(codinome);
        
        resposta.textContent = "✅ Agente '" + codinome + "' registrado com sucesso!";
        resposta.style.color = "#00ff9d";
        input.value = "";
        
        // Atualiza a lista na tela
        await renderizarLista();
        
    } catch (err) {
        resposta.textContent = "❌ Erro ao registrar. Tente novamente.";
        resposta.style.color = "#ff0055";
    }
});

// 6. Inicializar a lista quando a página abrir
renderizarLista();

async function salvarAgente(codinome) {
    const { data, error } = await _supabase
        .from('agentes')
        .insert([{ codinome: codinome }]);

    // ADICIONE ESSA LINHA ABAIXO PARA VER O QUE O BANCO RESPONDE:
    console.log("Resposta do Supabase:", { data, error }); 

    if (error) {
        console.error('Erro ao salvar:', error);
        throw error;
    }
}