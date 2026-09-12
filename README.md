# Pokédex Web

## Autor
Artur Maia de Morais — Matrícula 22610962

## Descrição
Aplicação web que busca Pokémon pelo nome ou número (ou sorteia um aleatoriamente) e exibe imagem, altura,
peso, tipos e geração. Útil para fãs consultarem rapidamente dados de qualquer Pokémon.

## API utilizada
- PokeAPI — https://pokeapi.co/docs/v2
- Endpoint consumido: 
- `https://pokeapi.co/api/v2/pokemon/{nome-ou-id}` (dados gerais do Pokémon)
- `https://pokeapi.co/api/v2/pokemon-species/{id}` (geração do Pokémon)

## Funcionalidades
- Busca por nome ou número (botão "Buscar" ou tecla Enter)
- Busca de um Pokémon aleatório (botão "Aleatório")
- Exibição de imagem, número, nome, altura (m), peso (kg), tipos e geração
- Imagem substituta qunado o sprite não está disponível
- Botões desabilitados durante o carregamento, evitando buscas duplicadas
- Mensagens amigáveis para busca sem resultado e falha de conexão

## Como executar localmente
1. Clone: `git clone https://github.com/amaia07/bootcamp_2.git`
2. Abra o arquivo `index.html` no navegador

## Links
- **Aplicação no ar (GitHub Pages):** https://amaia07.github.io/bootcamp_2/
- **Repositório:** https://github.com/AMaia07/bootcamp_2
