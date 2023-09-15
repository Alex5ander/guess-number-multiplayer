const nameInput = document.getElementById('name-input');
const playButton = document.getElementById('play-button');
const numbers = document.getElementById('numbers');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');

const formName = document.getElementById('form-name');
const game = document.getElementById('game');

/** @type {HTMLTableElement} */
const table = document.getElementById('table');

function play() {
  const name = nameInput.value;

  if (name.length > 2) {
    const socket = io({ query: { name } });

    formName.classList.add('hidde');
    game.classList.remove('hidde');

    socket.on('update-clients', (data) => {
      let rows = '';
      data.forEach(
        ({ name, score }) =>
          (rows += `<tr><td>${name}</td><td>${score}</td></tr>`)
      );
      table.tBodies[0].innerHTML = rows;
    });

    socket.on('numbers', (data) => {
      numbers.innerText = data.length > 0 ? data : '...';
    });

    function sendGuess() {
      socket.emit('guess', guessInput.value);
    }

    guessButton.addEventListener('click', sendGuess);
  }
}

playButton.addEventListener('click', play);
