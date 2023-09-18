const nameInput = document.getElementById('name-input');
/** @type {HTMLButtonElement} */
const playButton = document.getElementById('play-button');
const numbersP = document.getElementById('numbers');
const guessInput = document.getElementById('guess-input');
/** @type {HTMLButtonElement} */
const guessButton = document.getElementById('guess-button');

const formName = document.getElementById('form-name');
const formGame = document.getElementById('form-game');

let numbers = [];

/** @type {HTMLTableElement} */
const table = document.getElementById('table');

/** @param {number} number */
const IsValid = (number) =>
  !numbers.includes(number) && number >= 1 && number <= 100;

function play() {
  const name = nameInput.value;
  const socket = io({ query: { name } });

  document.getElementById('form-name-container').classList.add('hidde');
  document.getElementById('form-game-container').classList.remove('hidde');

  socket.on('update-clients', (data) => {
    let rows = '';
    data.forEach(
      ({ name, score }) =>
        (rows += `<tr><td>${name}</td><td>${score}</td></tr>`)
    );
    table.tBodies[0].innerHTML = rows;
  });

  socket.on('numbers', (data) => {
    numbers = data;
    numbersP.innerText = data.length > 0 ? data : '...';
  });

  socket.on('target', (data) =>
    alert(`${data.name} acertou!, o número secreto era ${data.secretNumber}`)
  );

  function sendGuess(number) {
    socket.emit('guess', number, (secretNumber) =>
      alert(`Parabéns você acertou! o número secreto era ${secretNumber}`)
    );
    guessInput.value = '';
    guessButton.disabled = true;
  }

  formGame.addEventListener('submit', (e) => {
    e.preventDefault();
    const number = parseInt(guessInput.value);
    if (IsValid(number)) {
      sendGuess(number);
    }
  });
}

nameInput.addEventListener('input', () => {
  const name = nameInput.value;
  playButton.disabled = name.length < 3 || name.length > 25;
});

guessInput.addEventListener('input', () => {
  guessButton.disabled = !IsValid(parseInt(guessInput.value));
});

formName.addEventListener('submit', (e) => {
  e.preventDefault();
  play();
});
