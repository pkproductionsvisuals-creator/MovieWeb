const API_KEY = 'c91bb0623cd0722ac307ea9d28424880';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

let filmes = [];
const movies = document.getElementById("movies")
const campoPesquisa = document.getElementById("search")

async function carregarFilmes() {

    try {

        const response = await fetch(API_URL);
        if (!response.ok){
            throw new Error("Erro ao obter os filmes da API");
        }
        const dados = await response.json();
        filmes = dados.results || [];
        
        exibirFilmes();

        
    } catch (erro) {
        console.error("Erro ao carregar os filmes contacte o programador ", erro)
        movies.innerHTML = "<p>Erro ao carregar os filmes.</p>"
    }

}


function exibirFilmes() {
 
    movies.innerHTML = ""; 

    if (filmes.length === 0) {
        movies.innerHTML = "<p>Sem filmes no momento</p>";
        return;
    } 

    filmes.forEach(filme =>{
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
        
        movies.appendChild(movie)

    })
}


function classificacao(votos){

    if(votos >= 8.5)
        return '#2ecc71' //green
    else if(votos >= 5 & votos < 8.5)
        return '#f1c40f' //yellow
    else
        return "#e74c3c"//'red'

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

        exibirFilmes();

    } catch (erro) {
        console.error("Erro ao pesquisar filmes:", erro);
        movies.innerHTML = "<p>Erro ao pesquisar filmes.</p>";
    }
});

carregarFilmes();