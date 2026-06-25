let pokemonAtual;

let vidas = 3;
let pontos = 0;

let vidasSpan = document.getElementById("vidas");
let pontosSpan = document.getElementById("pontos");

let pokemonImg = document.getElementById("pokemon");

let respostaInput = document.getElementById("resposta");

let mensagem = document.getElementById("mensagem");

let btnResponder = document.getElementById("btnResponder");

let btnPista = document.getElementById("btnPista");

// Carregar dados guardados
let dados = localStorage.getItem("jogo");

if (dados) {
  dados = JSON.parse(dados);

  vidas = dados.vidas;
  pontos = dados.pontos;

  vidasSpan.innerHTML = vidas;
  pontosSpan.innerHTML = pontos;
}

// Buscar Pokémon
function novoPokemon() {
  let id = Math.floor(Math.random() * 151) + 1;

  fetch("https://pokeapi.co/api/v2/pokemon/" + id)
    .then(function (resposta) {
      return resposta.json();
    })

    .then(function (pokemon) {
      pokemonAtual = pokemon;

      pokemonImg.src = pokemon.sprites.front_default;

      pokemonImg.classList.add("silhueta");
    });
}

// Verificar resposta
function verificarResposta() {
  let resposta = respostaInput.value.toLowerCase();

  if (resposta == pokemonAtual.name) {
    pontos = pontos + 100;

    pontosSpan.innerHTML = pontos;

    mensagem.innerHTML = "Acertaste!";

    guardarDados();

    novoPokemon();
  } else {
    vidas--;

    vidasSpan.innerHTML = vidas;

    mensagem.innerHTML = "Errado!";

    guardarDados();

    if (vidas <= 0) {
      alert("Fim do jogo! Pontos: " + pontos);
    }
  }
}

// Dar pista
function darPista() {
  alert("Primeira letra: " + pokemonAtual.name[0]);
}

// Guardar dados
function guardarDados() {
  let jogo = {
    vidas: vidas,
    pontos: pontos,
  };

  localStorage.setItem("jogo", JSON.stringify(jogo));
}

// Eventos
btnResponder.addEventListener("click", verificarResposta);

btnPista.addEventListener("click", darPista);

// Enter
document.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    verificarResposta();
  }
});

// Iniciar jogo
novoPokemon();
