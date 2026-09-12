const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";

const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
const areaResultado = document.getElementById("resultado");

async function buscarPokemon(termo) {
    areaResultado.innerHTML = "<p>Carregando...</p>";
    try {
        const resposta = await fetch(URL_BASE + termo);
        if (!resposta.ok) throw new Error("nao-encontrado");
        
        const dados = await resposta.json();
        
        const nome = dados.name;
        const imagem = dados.sprites.front_default;
        const altura = dados.height / 10; // decímetros -> metros
        const peso = dados.weight / 10;   // hectogramas -> kg
        const tipos = dados.types
            .map(t => `<span class="tipo">${t.type.name}</span>`)
            .join("");

        areaResultado.innerHTML = `
            <article class="cartao">
                <img src="${imagem}" alt="Imagem de ${nome}">
                <h2>#${dados.id} ${nome}</h2>
                <p><b>Altura:</b> ${altura} m | <b>Peso:</b> ${peso} kg</p>
                <div style="margin-top: 8px;">${tipos}</div>
            </article>
        `;
    } catch (erro) {
        const mensagem = erro.message === "nao-encontrado"
            ? `Nenhum Pokémon encontrado para "<b>${termo}</b>". Confira a grafia.`
            : "Não foi possível consultar a PokeAPI agora. Verifique sua conexão.";
        areaResultado.innerHTML = `<div class="erro">${mensagem}</div>`;
    }
}

function dispararBusca() {
    const termo = campoBusca.value.toLowerCase().trim();
    if (termo) buscarPokemon(termo);
}

botaoBuscar.addEventListener("click", dispararBusca);
campoBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") dispararBusca();
});