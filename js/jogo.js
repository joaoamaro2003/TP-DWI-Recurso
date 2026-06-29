// Variáveis

let pokemonAtual;

let vidas = 3;
let pontos = 0;
let tempo = 30;
let contador;

let historico = [];

// Elementos da página

let vidasSpan = document.getElementById("vidas");
let pontosSpan = document.getElementById("pontos");
let tempoSpan = document.getElementById("tempo");

let pokemonImg = document.getElementById("pokemon");

let respostaInput = document.getElementById("resposta");

let mensagem = document.getElementById("mensagem");

let btnResponder = document.getElementById("btnResponder");
let btnPista = document.getElementById("btnPista");
let btnGuardar = document.getElementById("btnGuardar");
let btnCSV = document.getElementById("btnCSV");

let nomeJogador = document.getElementById("nomeJogador");
let dificuldade = document.getElementById("dificuldade");

let modo = document.getElementById("modo");
let infoModo = document.getElementById("infoModo");
let pista = document.getElementById("pista");
let opcoes = document.getElementById("opcoes");

// Carregar dados guardados

let dados = localStorage.getItem("jogo");

if (dados) {
  dados = JSON.parse(dados);

  vidas = dados.vidas;
  pontos = dados.pontos;

  vidasSpan.innerHTML = vidas;
  pontosSpan.innerHTML = pontos;
}

// Guardar jogo

function guardarDados() {
  let jogo = {
    vidas: vidas,
    pontos: pontos,
  };

  localStorage.setItem("jogo", JSON.stringify(jogo));
}

// Guardar nome e dificuldade

btnGuardar.addEventListener("click", function () {
  localStorage.setItem("nome", nomeJogador.value);

  localStorage.setItem("dificuldade", dificuldade.value);

  alert("Dados guardados!");
});

// Mostrar nome guardado

if (localStorage.getItem("nome")) {
  nomeJogador.value = localStorage.getItem("nome");
}

if (localStorage.getItem("dificuldade")) {
  dificuldade.value = localStorage.getItem("dificuldade");
}

// Buscar Pokémon

function novoPokemon() {
  let maximo = Number(dificuldade.value);

  let id = Math.floor(Math.random() * maximo) + 1;

  fetch("https://pokeapi.co/api/v2/pokemon/" + id)
    .then(function (resposta) {
      return resposta.json();
    })

    .then(function (pokemon) {
      pokemonAtual = pokemon;

      pokemonImg.classList.remove("silhueta");

      pokemonImg.src = pokemon.sprites.front_default;

      pokemonImg.classList.add("silhueta");

      respostaInput.value = "";

      mensagem.innerHTML = "";

      iniciarTempo();
      aplicarModo();
    });
}

// Mostrar Pokémon
function mostrarPokemon() {
  pokemonImg.classList.remove("silhueta");
}

// Verificar resposta

function verificarResposta() {
  let resposta = respostaInput.value.toLowerCase();

  if (resposta == pokemonAtual.name) {
    mostrarPokemon();

    pontos = pontos + 100;

    pontosSpan.innerHTML = pontos;

    mensagem.innerHTML = "Acertaste!";

    clearInterval(contador);

    guardarDados();

    guardarHistorico();

    setTimeout(function () {
      novoPokemon();
    }, 1500);
  } else {
    vidas--;

    vidasSpan.innerHTML = vidas;

    mensagem.innerHTML = "Errado!";

    guardarDados();

    if (vidas <= 0) {
      clearInterval(contador);

      alert("Fim do jogo!");

      vidas = 3;
      pontos = 0;

      vidasSpan.innerHTML = vidas;
      pontosSpan.innerHTML = pontos;

      guardarDados();

      novoPokemon();
    }
  }
}

// Dar pista
function darPista() {
  alert("Primeira letra: " + pokemonAtual.name[0]);
}

// Temporizador

function iniciarTempo() {
  clearInterval(contador);

  tempo = 30;

  tempoSpan.innerHTML = tempo;

  contador = setInterval(function () {
    tempo--;

    tempoSpan.innerHTML = tempo;

    if (tempo == 0) {
      clearInterval(contador);

      vidas--;

      vidasSpan.innerHTML = vidas;

      guardarDados();

      if (vidas <= 0) {
        clearInterval(contador);

        alert("Fim do jogo!");

        vidas = 3;
        pontos = 0;

        vidasSpan.innerHTML = vidas;
        pontosSpan.innerHTML = pontos;

        guardarDados();

        novoPokemon();
      } else {
        novoPokemon();
      }
    }
  }, 1000);
}

// Histórico

function guardarHistorico() {
  let linha = {
    jogador: nomeJogador.value,
    pontos: pontos,
    modo: modo.value,
    dificuldade: dificuldade.value,
    data: new Date().toLocaleString(),
  };
  historico.push(linha);

  mostrarHistorico();
}

function mostrarHistorico() {
  let tabela = document.getElementById("historico");

  tabela.innerHTML = "";

  for (let i = 0; i < historico.length; i++) {
    tabela.innerHTML +=
      "<tr>" +
      "<td>" +
      historico[i].jogador +
      "</td>" +
      "<td>" +
      historico[i].pontos +
      "</td>" +
      "</tr>";
  }
}

// Exportar CSV

btnCSV.addEventListener("click", function () {
  let texto = "Jogador,Pontos,Modo,Dificuldade,Data\n";

  for (let i = 0; i < historico.length; i++) {
    texto += historico[i].jogador + ",";
    texto += historico[i].pontos + ",";
    texto += historico[i].modo + ",";
    texto += historico[i].dificuldade + ",";
    texto += historico[i].data + "\n";
  }

  let ficheiro = new Blob([texto], { type: "text/csv" });

  let link = document.createElement("a");

  link.href = URL.createObjectURL(ficheiro);

  link.download = "historico.csv";

  link.click();
});

// Eventos

btnResponder.addEventListener("click", verificarResposta);

btnPista.addEventListener("click", darPista);

// Enter e H

document.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    verificarResposta();
  }

  if (event.key == "h" || event.key == "H") {
    darPista();
  }
});

// Iniciar jogo
novoPokemon();

function aplicarModo() {
  let m = modo.value;

  // Aleatório
  if (m == "aleatorio") {
    let modos = ["silhueta", "estatisticas", "tipo", "evolucao"];

    m = modos[Math.floor(Math.random() * modos.length)];
  }

  infoModo.innerHTML = "Modo: " + m;

  // SILHUETA
  if (m == "silhueta") {
    pokemonImg.classList.add("silhueta");
    pista.innerHTML = "Adivinha pela imagem desfocada.";
  }

  // ESTATISTICAS
  if (m == "estatisticas") {
    pokemonImg.classList.remove("silhueta");

    pista.innerHTML =
      "HP: " +
      pokemonAtual.stats[0].base_stat +
      " | ATK: " +
      pokemonAtual.stats[1].base_stat;
  }

  // TIPO
  if (m == "tipo") {
    pokemonImg.classList.remove("silhueta");

    pista.innerHTML = "Tipo: " + pokemonAtual.types[0].type.name;
  }

  // EVOLUCAO (versão simples)
  if (m == "evolucao") {
    pokemonImg.classList.remove("silhueta");

    pista.innerHTML = "Qual é a evolução deste Pokémon?";
  }
}
