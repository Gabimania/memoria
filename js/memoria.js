document.addEventListener("DOMContentLoaded", () => {
  const matches = document.getElementById("matches");
  const mistakes = document.getElementById("mistakes");
  const totalClics = document.getElementById("totalClics");
  const timer = document.getElementById("timer");
  const startGameButton = document.getElementById("start-game");
  const gameBoard = document.getElementById("game-board");

  let firstCard = null;
  let secondCard = null;
  let lock = false;
  let matchCount = 0;
  let mistakesCount = 0;
  let clicCount = 0;
  let startTime;
  let interval;
  let totalPairs = 8;

  startGameButton.addEventListener("click", startGame);

  function startGame() {
    matches.textContent = "Aciertos: 0";
    mistakes.textContent = "Errores: 0";
    totalClics.textContent = "Total de Clics: 0";
    timer.textContent = "Tiempo 00:00";
    gameBoard.innerHTML = "";

    startTime = Date.now();

    const images = [
      "fisio.jpg",
      "fisio.jpg",
      "sem.jpg",
      "sem.jpg",
      "seo.jpg",
      "seo.jpg",
      "sushi.jpg",
      "sushi.jpg",
      "tacos.jpg",
      "tacos.jpg",
      "tarta.jpg",
      "tarta.jpg",
      "taza-cafe.jpg",
      "taza-cafe.jpg",
      "wordpress.jpg",
      "wordpress.jpg",
    ];

    shuffle(images);

    for (let i = 0; i < images.length; i++) {
      let card = document.createElement("div");
      card.classList.add("card");
      card.dataset.image = images[i];

      let img = document.createElement("img");
      img.src = "img/carta.jpg";
      card.appendChild(img);

      card.addEventListener("click", flipCard);

      gameBoard.appendChild(card);
    }

    interval = setInterval(updateTimer, 1000);
  }

  function flipCard() {
    if (lock) return;

    const card = this;
    if (card.dataset.flipped === "true") return;

    clicCount++;
    totalClics.textContent = `Total de Clics: ${clicCount}`;

    let img = card.querySelector("img");
    img.src = `img/${card.dataset.image}`;
    card.dataset.flipped = "true";

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      lock = true;

      setTimeout(checkForMatch, 1000);
    }
  }

  function checkForMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
      matchCount++;
      matches.textContent = `Aciertos: ${matchCount}`;
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);

      if (matchCount === totalPairs) {
        clearInterval(interval);
        setTimeout(() => {
          let playAgain = confirm(
            "Has conseguido encontrar todas las parejas. ¿Quieres echar otra partida?"
          );
          if (playAgain) {
            startGame();
          }
        }, 100);
      }
    } else {
      mistakesCount++;
      mistakes.textContent = `Errores: ${mistakesCount}`;
      firstCard.querySelector("img").src = "img/carta.jpg";
      secondCard.querySelector("img").src = "img/carta.jpg";
      firstCard.dataset.flipped = "false";
      secondCard.dataset.flipped = "false";
    }

    firstCard = null;
    secondCard = null;
    lock = false;
  }

  function shuffle(array) {
    for (i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function updateTimer() {
    let gameTime = Math.floor((Date.now() - startTime) / 1000);
    let minutes = String(Math.floor(gameTime / 60)).padStart(2, "0");
    let seconds = String(gameTime % 60).padStart(2, "0");
    timer.textContent = `Tiempo: ${minutes}:${seconds}`;
  }
});
