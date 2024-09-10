document.addEventListener("DOMContentLoaded", () => {
  const matches = document.getElementById("matches");
  const mistakes = document.getElementById("mistakes");
  const totalClics = document.getElementById("totalClics");
  const timer = document.getElementById("timer");
  const startGameButton = document.getElementById("start-game");
  const gameBoard = document.getElementById("game-board");

  let firstCard = null; //Almacena la primera carta seleccionada en cada turno
  let secondCard = null; //Almacena la segunda carta seleccioanda en cada turno
  let lock = false; // Evita que se volteen más de dos cartas al mismo tiempo
  let matchCount = 0;
  let mistakesCount = 0;
  let clicCount = 0;
  let startTime;
  let interval;
  let totalPairs = 8;


//Evento de inicio de juego añadido a botón
  startGameButton.addEventListener("click", startGame);

//Método para iniciar el juego 
  function startGame() {
    matches.textContent = "Aciertos: 0";
    mistakes.textContent = "Errores: 0";
    totalClics.textContent = "Total de Clics: 0";
    timer.textContent = "Tiempo 00:00";
    gameBoard.innerHTML = "";
//Reseteo de contadores
    clicCount= 0;
    matchCount = 0;
    mistakesCount= 0;

    startTime = Date.now();

    const images = [
      "persona.jpg",
      "persona.jpg",
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
    //Se baraja el array de imágenes 
    shuffle(images);

    /* Para cada imagen, se crea un div con la clase 'card' y se asocia la imagen correspondiente.
    *  Dentro de cada div se inserta una imagen con 'carta.jpg' (cara oculta inicial).
    *  Luego, se añade un evento 'click' que llamará a la función 'flipCard' al hacer clic.
    */
  
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

    //El metodo updateTimer se actualiza cada segundo para obtener el tiempo que ha transcurrido desde el inicio de la partida.
    interval = setInterval(updateTimer, 1000);
  }


   /* Función que voltea la carta.
  *  Si 'lock' es verdadero, impide que se volteen más cartas.
  *  Si la carta ya fue volteada (propiedad 'flipped'), también se sale.
  *  Aumenta el número de clics, muestra la imagen de la carta y la marca como volteada.
  *  Si no hay una primera carta seleccionada, se asigna a 'firstCard'.
  *  Si ya hay una, se asigna a 'secondCard' y se bloquean más clics con 'lock' hasta que se chequeen.
  */

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
     // Llama a 'checkForMatch' después de 1 segundo para verificar si las dos cartas coinciden
      setTimeout(checkForMatch, 1000);
    }
  }

/* Función que verifica si las dos cartas seleccionadas coinciden.
  *  Si coinciden, incrementa el contador de aciertos, elimina los eventos de clic y verifica si se han encontrado todas las parejas.
  *  Si no coinciden, incrementa el contador de errores y las voltea de nuevo.
  */

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
            startGame(); // Reinicia el juego si el jugador acepta
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

    firstCard = null; // Resetea las cartas seleccionadas
    secondCard = null;
    lock = false; // Desbloquea el volteo de cartas
  }

   // Algoritmo de Fisher-Yates para barajar el array de imágenes
  function shuffle(array) {
    for (i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  //Función para actualizar el tiempo en minutos y segundos

  function updateTimer() {
    let gameTime = Math.floor((Date.now() - startTime) / 1000);
    let minutes = String(Math.floor(gameTime / 60)).padStart(2, "0");
    let seconds = String(gameTime % 60).padStart(2, "0");
    timer.textContent = `Tiempo: ${minutes}:${seconds}`;
  }
});
