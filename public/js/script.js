const nameInput = document.getElementById('name-input');
/** @type {HTMLButtonElement} */
const playButton = document.getElementById('play-button');
const numbersP = document.getElementById('numbers');
const guessInput = document.getElementById('guess-input');
/** @type {HTMLButtonElement} */
const guessButton = document.getElementById('guess-button');

const formName = document.getElementById('form-name');
const game = document.getElementById('game');

/** @type {HTMLTableElement} */
const table = document.getElementById('table');

function play() {
  const name = nameInput.value;

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
    numbersP.innerText = data.length > 0 ? data : '...';
  });

  function sendGuess() {
    const number = guessInput.value;
    if (!Number.isNaN(number)) {
      socket.emit('guess', guessInput.value);
      guessInput.value = '';
      guessButton.disabled = true;
    }
  }

  guessButton.addEventListener('click', sendGuess);
}

nameInput.addEventListener('input', () => {
  const name = nameInput.value;
  playButton.disabled = name.length < 3 || name.length > 25;
});

guessInput.addEventListener('input', () => {
  const number = guessInput.value;
  const invalidNumber =
    numbersP.textContent.split(',').includes(number) ||
    number < 1 ||
    number > 100;
  guessButton.disabled = invalidNumber;
});
playButton.addEventListener('click', play);
