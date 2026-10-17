# Pokédex Web

## Autor
Artur Maia de Morais — Matrícula 22610962

## Descrição
Aplicação web que busca Pokémon pelo nome ou número (ou sorteia um aleatoriamente) e exibe imagem, altura, peso, tipos e geração. Na Etapa 02, ganhou persistência em banco de dados (um time de Pokémon favoritos).

## Links
- **Aplicação no ar (GitHub Pages):** https://amaia07.github.io/bootcamp_2/
- **Repositório no GitHub:** https://github.com/AMaia07/bootcamp_2

## Como executar localmente (sem Docker)
1. Clone: `git clone https://github.com/AMaia07/bootcamp_2.git`
2. Abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code)

## API utilizada
- PokeAPI — https://pokeapi.co/docs/v2
- Endpoint consumido: 
- `https://pokeapi.co/api/v2/pokemon/{nome-ou-id}` (dados gerais do Pokémon)
- `https://pokeapi.co/api/v2/pokemon-species/{id}` (geração do Pokémon)

## Funcionalidades
- Busca por nome ou número (botão "Buscar" ou tecla Enter)
- Busca de um Pokémon aleatório (botão "Aleatório")
- Exibição de imagem, número, nome, altura (m), peso (kg), tipos e geração
- Imagem substituta quando o sprite não está disponível
- Validação de campo vazio e botões desabilitados durante o carregamento
- Mensagens amigáveis para busca sem resultado e falha de conexão
- **Meu time:** adicionar um Pokémon ao time, listar o time salvo e removê-lo
- Bloqueio de Pokémon duplicado no time (melhoria da versão 1.1 da imagem)

## Persistência de dados

- **Banco escolhido:** Supabase (PostgreSQL), acessado direto do frontend pela biblioteca `supabase-js`.
- **Tabela `time`:**

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | int8 | Identificador gerado automaticamente |
| `created_at` | timestamptz | Data e hora em que o Pokémon foi adicionado |
| `nome_pokemon` | text | Nome do Pokémon |
| `numero` | int8 | Número na Pokédex |
| `imagem` | text | URL do sprite |
| `tipos` | text | Tipos separados por vírgula (ex.: `fighting, steel`) |

- **O que é salvo:** os Pokémon que o usuário adiciona ao seu time. Os dados continuam lá depois de fechar o navegador ou recarregar a página.
- **Operações:** *Create* (botão "Adicionar ao time"), *Read* (seção "Meu time", carregada ao abrir a página) e *Delete* (botão "Remover"). O *Update* não foi implementado (era bônus).
- **Limitação conhecida:** as políticas de acesso (RLS) da tabela estão abertas para o papel `anon` (SELECT, INSERT e DELETE), como a etapa permite. Isso significa que não há login: todos os visitantes compartilham o mesmo time, e qualquer pessoa com a chave pública poderia alterar os dados. Em um produto real, o correto seria autenticar o usuário e criar políticas por usuário.