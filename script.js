import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ======= CONFIGURAÇÃO DO SUPABASE =======
// Troque pelos valores do SEU projeto (Project Settings -> API)
const URL_SUPABASE = "https://bvfcburnqcfwyjwdajup.supabase.co";
const CHAVE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZmNidXJucWNmd3lqd2RhanVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNzU0MzAsImV4cCI6MjEwNzc1MTQzMH0.v7sJPL6W5AgrCfpuSszzEx2LEWLhwbnYTxjIDv_d49M";
const supabase = createClient(URL_SUPABASE, CHAVE_ANON);
// ==========================================

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const IMAGEM_PADRAO = "https://via.placeholder.com/140?text=?";
const TOTAL_POKEMONS = 1010; // quantidade de Pokémon cadastrados na PokeAPI

// Nomes amigáveis para cada geração retornada pela API (ex.: "generation-i")
const GERACOES = {
    "generation-i": "1ª Geração — Kanto",
    "generation-ii": "2ª Geração — Johto",
    "generation-iii": "3ª Geração — Hoenn",
    "generation-iv": "4ª Geração — Sinnoh",
    "generation-v": "5ª Geração — Unova",
    "generation-vi": "6ª Geração — Kalos",
    "generation-vii": "7ª Geração — Alola",
    "generation-viii": "8ª Geração — Galar",
    "generation-ix": "9ª Geração — Paldea"
};

const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const areaResultado = document.getElementById("resultado");
const listaTime = document.getElementById("lista-time");

function alternarBotoes(desabilitar) {
    botaoBuscar.disabled = desabilitar;
    botaoAleatorio.disabled = desabilitar;
}

// Busca a espécie do Pokémon para descobrir a geração (endpoint separado da PokeAPI)
async function buscarGeracao(urlEspecie) {
    try {
        const resposta = await fetch(urlEspecie);
        if (!resposta.ok) return "Geração desconhecida";

        const dados = await resposta.json();
        const chave = dados.generation.name; // ex.: "generation-i"
        return GERACOES[chave] || chave;
    } catch {
        return "Geração desconhecida";
    }
}

async function buscarPokemon(termo) {
    areaResultado.innerHTML = "<p>Carregando...</p>";
    alternarBotoes(true);

    try {
        const resposta = await fetch(URL_BASE + termo);
        if (!resposta.ok) throw new Error("nao-encontrado");

        const dados = await resposta.json();

        const nome = dados.name;
        const imagem = dados.sprites.front_default || IMAGEM_PADRAO;
        const altura = dados.height / 10; // decímetros -> metros
        const peso = dados.weight / 10;   // hectogramas -> kg
        const listaTipos = dados.types.map(t => t.type.name);
        const tipos = listaTipos
            .map(t => `<span class="tipo">${t}</span>`)
            .join("");

        // Segunda consulta: geração (endpoint pokemon-species, referenciado em dados.species.url)
        const geracao = await buscarGeracao(dados.species.url);

        areaResultado.innerHTML = `
            <article class="cartao">
                <img src="${imagem}" alt="Imagem de ${nome}">
                <h2>#${dados.id} ${nome}</h2>
                <p><b>Altura:</b> ${altura} m | <b>Peso:</b> ${peso} kg</p>
                <p class="geracao">${geracao}</p>
                <div style="margin-top: 8px;">${tipos}</div>
                <button
                    class="btn-adicionar"
                    data-nome="${nome}"
                    data-numero="${dados.id}"
                    data-imagem="${imagem}"
                    data-tipos="${listaTipos.join(", ")}"
                >Adicionar ao time</button>
            </article>
        `;
    } catch (erro) {
        const mensagem = erro.message === "nao-encontrado"
            ? `Nenhum Pokémon encontrado para "<b>${termo}</b>". Confira a grafia.`
            : "Não foi possível consultar a PokeAPI agora. Verifique sua conexão.";
        areaResultado.innerHTML = `<div class="erro">${mensagem}</div>`;
    } finally {
        alternarBotoes(false);
    }
}

function dispararBusca() {
    const termo = campoBusca.value.toLowerCase().trim();

    if (!termo) {
        areaResultado.innerHTML = `<p>Digite um nome ou número para buscar.</p>`;
        return;
    }

    buscarPokemon(termo);
}

function dispararBuscaAleatoria() {
    const idSorteado = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;
    campoBusca.value = idSorteado; // mostra no campo qual número foi sorteado
    buscarPokemon(idSorteado);
}

// ---------- CRUD do time (Supabase) ----------

// CREATE — adiciona um Pokémon ao time (evita duplicados)
async function adicionarAoTime(pokemon) {
    // Verifica se esse Pokémon já está no time antes de inserir
    const { data: existentes, error: erroConsulta } = await supabase
        .from("time")
        .select("id")
        .eq("numero", pokemon.numero);

    if (erroConsulta) {
        console.error(erroConsulta);
        alert("Não foi possível verificar o time. Veja o console (F12) para detalhes.");
        return;
    }

    if (existentes && existentes.length > 0) {
        alert(`${pokemon.nome} já está no seu time!`);
        return;
    }

    const { error } = await supabase.from("time").insert({
        nome_pokemon: pokemon.nome,
        numero: pokemon.numero,
        imagem: pokemon.imagem,
        tipos: pokemon.tipos
    });

    if (error) {
        console.error(error);
        alert("Não foi possível adicionar ao time. Veja o console (F12) para detalhes.");
        return;
    }

    listarTime();
}

// READ — lista os Pokémon salvos no time
async function listarTime() {
    const { data, error } = await supabase
        .from("time")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        listaTime.innerHTML = `<div class="erro">Não foi possível carregar seu time agora.</div>`;
        return;
    }

    if (!data || data.length === 0) {
        listaTime.innerHTML = `<p>Seu time está vazio. Busque um Pokémon e clique em "Adicionar ao time".</p>`;
        return;
    }

    listaTime.innerHTML = data.map(item => `
        <article class="cartao-time">
            <img src="${item.imagem}" alt="Imagem de ${item.nome_pokemon}">
            <div>
                <h3>#${item.numero} ${item.nome_pokemon}</h3>
                <p>${item.tipos}</p>
            </div>
            <button class="btn-remover" data-id="${item.id}">Remover</button>
        </article>
    `).join("");
}

// DELETE — remove um Pokémon do time
async function removerDoTime(id) {
    const { error } = await supabase.from("time").delete().eq("id", id);

    if (error) {
        console.error(error);
        alert("Não foi possível remover. Veja o console (F12) para detalhes.");
        return;
    }

    listarTime();
}

// ---------- Eventos ----------

botaoBuscar.addEventListener("click", dispararBusca);
botaoAleatorio.addEventListener("click", dispararBuscaAleatoria);
campoBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") dispararBusca();
});

// Delegação de evento: o botão "Adicionar ao time" só existe depois da busca,
// por isso o listener fica no container pai (resultado), não no botão em si.
areaResultado.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-adicionar")) return;

    adicionarAoTime({
        nome: e.target.dataset.nome,
        numero: e.target.dataset.numero,
        imagem: e.target.dataset.imagem,
        tipos: e.target.dataset.tipos
    });
});

// O mesmo padrão para os botões "Remover" dentro da lista do time
listaTime.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-remover")) return;
    removerDoTime(e.target.dataset.id);
});

// Carrega o time salvo assim que a página abre
listarTime();