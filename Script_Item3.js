const API_KEY = 'c91bb0623cd0722ac307ea9d28424880';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

// Mapeamento oficial de IDs de Géneros do TMDb
const generosTMDB = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    36: "História",
    27: "Terror",
    10402: "Música",
    9648: "Mistério",
    10749: "Romance",
    878: "Ficção Científica",
    10770: "Cinema TV",
    53: "Thriller",
    10752: "Guerra",
    37: "Faroeste"
};

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
        
        exibirFilmesAgrupados();
        
    } catch (erro) {
        console.error("Erro ao carregar os filmes contacte o programador ", erro);
        movies.innerHTML = "<p>Erro ao carregar os filmes.</p>";
    }
}

function exibirFilmesAgrupados() {
    movies.innerHTML = ""; 

    if (filmes.length === 0) {
        movies.innerHTML = "<p>Sem filmes no momento</p>";
        return;
    } 

    // Agrupar os filmes por género
    const filmesPorGenero = {};
    filmes.forEach(filme => {
        const generoId = (filme.genre_ids && filme.genre_ids.length > 0) ? filme.genre_ids[0] : null;
        const genero = generoId && generosTMDB[generoId] ? generosTMDB[generoId] : "Outros";

        if (!filmesPorGenero[genero]) {
            filmesPorGenero[genero] = [];
        }
        filmesPorGenero[genero].push(filme);
    });

    // Obter os géneros ordenados alfabeticamente
    const generosOrdenados = Object.keys(filmesPorGenero).sort();

    generosOrdenados.forEach((genero, index) => {
        // Criar um cabeçalho para o género (com grid-column para ocupar a largura toda)
        const secaoGenero = document.createElement("div");
        secaoGenero.classList.add("genero-secao");
        secaoGenero.innerHTML = `<h2 style="color: #fff; width: 100%; margin: 20px 0 10px 0; grid-column: 1 / -1;">Género: ${genero}</h2>`;
        movies.appendChild(secaoGenero);

        // Renderizar os filmes desse género diretamente no movies
        filmesPorGenero[genero].forEach(filme => {
            const movie = document.createElement("div");
            movie.classList.add("movie");

            const imagem = filme.poster_path
                ? `${IMG_PATH}${filme.poster_path}`
                : "";

            const dataLancamento = filme.release_date 
                ? filme.release_date.split('-').reverse().join('/') 
                : "Data indisponível";

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

                <div class="release-date">
                    <small>Lançamento: ${dataLancamento}</small>
                </div>

                <div class="overview">
                    <h3>Sinopse</h3>
                    <p>${filme.overview || "Sinopse indisponivel."}</p>
                </div>
            `;
            
            movies.appendChild(movie);
        });

        // Adicionar a tag <hr> entre os grupos de géneros (exceto no último)
        if (index < generosOrdenados.length - 1) {
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
        
        exibirFilmesAgrupados();

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