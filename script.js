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
        const tipos = dados.types
            .map(t => `<span class="tipo">${t.type.name}</span>`)
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

botaoBuscar.addEventListener("click", dispararBusca);
botaoAleatorio.addEventListener("click", dispararBuscaAleatoria);
campoBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") dispararBusca();
});
