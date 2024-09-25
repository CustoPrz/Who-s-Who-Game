document.addEventListener('DOMContentLoaded', function () {
  const gameBoard = document.getElementById('game-board');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const chatMessages = document.getElementById('chat-messages');
  const characterBox = document.getElementById('character-slot');

  let nombreUsuario;
  let socket;

  const startButton = document.createElement('button');
  startButton.textContent = 'Comenzar Juego';
  startButton.id = 'start-button';
  startButton.onclick = function () {
   
    nombreUsuario = prompt('Ingresa tu nombre de usuario:');
    const salaId = prompt('Ingresa el ID de la sala:');

    socket = io();
    socket.emit('unirseASala', salaId);

    socket.on('seed', function (seed) {
      iniciarJuego(seed);

      gameBoard.removeChild(startButton);
      gameBoard.removeChild(tutorialElement);
    });

    socket.on('usuarioUnido', function (mensaje) {
      console.log(mensaje);
    });

    socket.on('usuarioDesconectado', function (mensaje) {
      console.log(mensaje);
    });

    sendButton.addEventListener('click', () => {
      const message = chatInput.value;
      if (message.trim() !== '') {
        socket.emit('chatMessage', { usuario: nombreUsuario, mensaje: message });
        chatInput.value = '';
      }
    });
    chatInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        
        const message = chatInput.value.trim();
        if (message !== '') {
          socket.emit('chatMessage', { usuario: nombreUsuario, mensaje: message });
          chatInput.value = '';
        }
      }
    });
    socket.on('chatMessage', (data) => {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${data.usuario}: ${data.mensaje}`;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  };

  const tutorialText = `
    <div id="tutorial">
      <h2>¡Bienvenido a Who's Who: One Piece Edition!</h2>
    
      <p>Antes de comenzar, te recomendamos que estés en una llamada de Discord con tu amigo para una mejor experiencia de juego.</p>
    
      <h3>Reglas del juego:</h3>
      <ul>
        <li>Cada jugador elige un personaje de One Piece de la galería.</li>
        <li>Durante tu turno, haz preguntas estratégicas para adivinar el personaje secreto de tu oponente.</li>
        <li>Usa la lógica para reducir la cantidad de personajes posibles.</li>
        <li>¡El primer jugador en adivinar correctamente el personaje secreto del otro gana!</li>
      </ul>
    
      <p>¡Que empiece la diversión!</p>
    </div>
  `;

  const tutorialElement = document.createElement('div');
  tutorialElement.innerHTML = tutorialText;
  gameBoard.appendChild(tutorialElement);
  gameBoard.appendChild(startButton);

  function iniciarJuego(randomSeed) {
    var myrng = new Math.seedrandom(randomSeed);
    var characters = [];

    for (var i = 1; i <= 127; i++) {
      var filename = 'Fotos/' + i + '.png';
      characters.push(filename);
    }

    for (var i = 0; i < 40; i++) {
      var randomIndex = Math.floor(myrng() * characters.length);
      var character = characters.splice(randomIndex, 1)[0];

      var card = document.createElement('div');
      card.className = 'card';
      card.style.backgroundImage = "url('" + character + "')";
      card.setAttribute('data-character-url', character);
      card.draggable = true; 
      card.addEventListener('click', function() {
        flipCard(this);
      });
      card.ondragstart = function(event) {
        const backgroundImageUrl = this.style.backgroundImage.slice(4, -1).replace(/['"]/g, '');
        event.dataTransfer.setData('text/plain', backgroundImageUrl);
      };

      gameBoard.appendChild(card);
    }
  }

  characterBox.ondrop = function(event) {
    event.preventDefault();
    const characterUrl = event.dataTransfer.getData('text/plain');
    characterBox.style.backgroundImage = `url('${characterUrl}')`;
    characterBox.style.backgroundSize = 'cover'; 
    characterBox.style.backgroundPosition = 'center';
  };

  characterBox.ondragover = function(event) {
    event.preventDefault();
  };

  function flipCard(card) {
    if (card.classList.contains('card-flip')) {
        card.classList.remove('card-flip');
        const characterUrl = card.getAttribute('data-character-url');
        setTimeout(function() {
          card.style.backgroundImage = "url('" + characterUrl + "')";
      }, 260)
    } else {
        card.classList.add('card-flip');
        setTimeout(function() {
          card.style.backgroundImage = "url('Fotos/Reverso.jpg')";
      }, 260);
    }
}
});
