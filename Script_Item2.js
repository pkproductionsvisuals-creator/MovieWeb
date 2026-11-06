const API_KEY = 'c91bb0623cd0722ac307ea9d28424880';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
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
        
        // Ordenar inicialmente por ano (mais recente para o mais velho)
        ordenarPorAnoRecente();
        exibirFilmesAgrupados();
        
    } catch (erro) {
        console.error("Erro ao carregar os filmes contacte o programador ", erro);
        movies.innerHTML = "<p>Erro ao carregar os filmes.</p>";
    }
}

// Função para ordenar os filmes do ano mais recente para o mais velho
function ordenarPorAnoRecente() {
    filmes.sort((a, b) => {
        const anoA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
        const anoB = b.release_date ? new Date(b.release_date).getFullYear() : 0;
        return anoB - anoA; // Ordem decrescente (mais recente primeiro)
    });
}

function exibirFilmesAgrupados() {
    movies.innerHTML = ""; 

    if (filmes.length === 0) {
        movies.innerHTML = "<p>Sem filmes no momento</p>";
        return;
    } 

    // Agrupar os filmes por ano
    const filmesPorAno = {};
    filmes.forEach(filme => {
        const ano = filme.release_date ? new Date(filme.release_date).getFullYear() : "Desconhecido";
        if (!filmesPorAno[ano]) {
            filmesPorAno[ano] = [];
        }
        filmesPorAno[ano].push(filme);
    });

    // Obter os anos ordenados de forma decrescente (mais recente para mais velho)
    const anosOrdenados = Object.keys(filmesPorAno).sort((a, b) => b - a);

    anosOrdenados.forEach((ano, index) => {
        // Criar um cabeçalho para o ano
        const secaoAno = document.createElement("div");
        secaoAno.classList.add("ano-secao");
        secaoAno.innerHTML = `<h2 style="color: #fff; width: 100%; margin: 20px 0 10px 0; grid-column: 1 / -1;">${ano}</h2>`;
        movies.appendChild(secaoAno);

        // Renderizar os filmes desse ano
        filmesPorAno[ano].forEach(filme => {
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

        // Adicionar a tag <hr> entre os grupos de anos (exceto no último)
        if (index < anosOrdenados.length - 1) {
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
        
        ordenarPorAnoRecente();
        exibirFilmesAgrupados();

    } catch (erro) {
        console.error("Erro ao pesquisar filmes:", erro);
        movies.innerHTML = "<p>Erro ao pesquisar filmes.</p>";
    }
});

//MENU
const menuToggle = document.getElementById("menu-toggle");
const menuIcon = document.getElementById("menu-icon");
// Abrir e fechar o menu
menuToggle.addEventListener("click", () => {
    // Alternar a classe responsável pela animação
    document.body.classList.toggle("menu-open");
    // Verificar se o menu está aberto
    const menuAberto = document.body.classList.contains("menu-open");
    // Alterar o ícone do botão
    if (menuAberto) {
        menuIcon.textContent = "×";
        menuToggle.setAttribute("aria-label", "Fechar menu");
        menuToggle.setAttribute("aria-expanded", "true");
    } else {
        menuIcon.textContent = "☰";
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.setAttribute("aria-expanded", "false");
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