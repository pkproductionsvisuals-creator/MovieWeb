const API_KEY = 'c91bb0623cd0722ac307ea9d28424880';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=2`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

let filmes = [];
const movies = document.getElementById("movies");
const campoPesquisa = document.getElementById("search");

const homeButton = document.getElementById("home");
const linguasButton = document.getElementById("Linguas");
const dataButton = document.getElementById("Data");
const generoButton = document.getElementById("genero");
const contatosButton = document.getElementById("contatos");

async function carregarFilmes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok){
            throw new Error("Erro ao obter os filmes da API");
        }
        const dados = await response.json();
        filmes = dados.results || [];
        
        exibirFilmesAgrupadosPorIdioma();
        
    } catch (erro) {
        console.error("Erro ao carregar os filmes contacte o programador ", erro);
        movies.innerHTML = "<p>Erro ao carregar os filmes.</p>";
    }
}

function exibirFilmesAgrupadosPorIdioma() {
    movies.innerHTML = ""; 

    if (filmes.length === 0) {
        movies.innerHTML = "<p>Sem filmes no momento</p>";
        return;
    } 

    // Mapeamento opcional para deixar os nomes dos idiomas mais legíveis
    const nomesIdiomas = {
        'en': 'Inglês (English)',
        'it': 'Italiano (Italiano)',
        'pt': 'Português',
        'es': 'Espanhol (Español)',
        'fr': 'Francês (Français)',
        'ja': 'Japonês',
        'ko': 'Coreano',
        'de': 'Alemão (Deutsch)',
        'hi': 'Hindi'
    };

    // Agrupar os filmes pelo idioma original (original_language)
    const filmesPorIdioma = {};
    filmes.forEach(filme => {
        const idioma = filme.original_language ? filme.original_language.toLowerCase() : "desconhecido";
        if (!filmesPorIdioma[idioma]) {
            filmesPorIdioma[idioma] = [];
        }
        filmesPorIdioma[idioma].push(filme);
    });

    // Obter as chaves dos idiomas ordenadas alfabeticamente
    const idiomasOrdenados = Object.keys(filmesPorIdioma).sort();

    idiomasOrdenados.forEach((idioma, index) => {
        // Obter nome formatado ou colocar em maiúsculas (ex: 'EN')
        const nomeIdioma = nomesIdiomas[idioma] || idioma.toUpperCase();

        // Criar o cabeçalho para o idioma
        const secaoIdioma = document.createElement("div");
        secaoIdioma.classList.add("idioma-secao");
        secaoIdioma.innerHTML = `<h2 style="color: #fff; width: 100%; margin: 25px 0 10px 0; grid-column: 1 / -1; text-transform: uppercase; font-size: 1.4rem;">Idioma: ${nomeIdioma}</h2>`;
        movies.appendChild(secaoIdioma);

        // Renderizar os filmes desse idioma
        filmesPorIdioma[idioma].forEach(filme => {
            const movie = document.createElement("div");
            movie.classList.add("movie");

            const imagem = filme.poster_path
                ? `${IMG_PATH}${filme.poster_path}`
                : "";

            movie.innerHTML = `
                <div class="imag">
                    ${
                        imagem
                            ? `<img src="${imagem}" alt="${filme.title}">`
                            : `<p>Imagem indisponível</p>`
                    }
                </div>

                <div class="text">
                    <p class="title">${filme.title}</p>
                    <span
                        class="rating"
                        style="color: ${classificacao(filme.vote_average)}"
                    >
                        ${filme.vote_average.toFixed(1)}
                    </span>
                </div>

                <div class="overview">
                    <h3>Sinopse</h3>
                    <p>${filme.overview || "Sinopse indisponivel."}</p>
                </div>
            `;
            
            movies.appendChild(movie);
        });

        // Adicionar a tag <hr> entre os grupos de idiomas diferentes (exceto no último)
        if (index < idiomasOrdenados.length - 1) {
            const divisor = document.createElement("hr");
            divisor.style.cssText = "grid-column: 1 / -1; border: 0; border-top: 1px solid rgba(255,255,255,0.15); margin: 30px 0;";
            movies.appendChild(divisor);
        }
    });
}

function classificacao(votos){
    if(votos >= 8.5)
        return '#2ecc71'; //green
    else if(votos >= 5 && votos < 8.5)
        return '#f1c40f'; //yellow
    else
        return "#e74c3c"; //red
}

campoPesquisa.addEventListener("input", async () => {
    const termoPesquisa = campoPesquisa.value.trim();

    if (termoPesquisa === "") {
        carregarFilmes();
        return;
    }

    try {
        const response = await fetch(
            `${SEARCH_API}${encodeURIComponent(termoPesquisa)}`
        );

        if (!response.ok) {
            throw new Error("Erro ao pesquisar filmes");
        }

        const dados = await response.json();
        filmes = dados.results || [];

        exibirFilmesAgrupadosPorIdioma();

    } catch (erro) {
        console.error("Erro ao pesquisar filmes:", erro);
        movies.innerHTML = "<p>Erro ao pesquisar filmes.</p>";
    }
});

homeButton.addEventListener("click", () => {
    window.location.href = "index.html";
});

linguasButton.addEventListener("click", () => {
    window.location.href = "Item1.html";
});

dataButton.addEventListener("click", () => {
    window.location.href = "Item2.html";
});

generoButton.addEventListener("click", () => {
    window.location.href = "Item3.html";
});

contatosButton.addEventListener("click", () => {
    window.location.href = "contato.html";
});

carregarFilmes();