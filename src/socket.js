const { Server } = require('socket.io');
const server = require('./app.js');

const io = new Server(server);

const random = () => 1 + Math.floor(Math.random() * 100);

let clients = [];
let numbers = [];
let secretNumber = 10;

const UpdateClients = () =>
  io.emit(
    'update-clients',
    clients.sort((a, b) => b.score - a.score)
  );

const UpdateNumbers = () =>
  io.emit(
    'numbers',
    numbers.sort((a, b) => a - b)
  );

/** @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket */
const OnConnection = (socket) => {
  const name = socket.handshake.query.name;

  if (name.length < 3 || name.length > 25) {
    socket.disconnect();
    return;
  }

  clients.push({ name, id: socket.id, score: 0 });

  UpdateClients();
  UpdateNumbers();
};

const IsValid = (number) =>
  !Number.isNaN(number) &&
  number >= 1 &&
  number <= 100 &&
  !numbers.includes(number);

/** @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket */
const OnGuess = (socket) => {
  socket.on('guess', (data, callback) => {
    if (IsValid(data)) {
      numbers.push(data);

      if (secretNumber == data) {
        const client = clients.find((e) => e.id == socket.id);
        client.score++;

        UpdateClients();

        socket.broadcast.emit('target', { name: client.name, secretNumber });
        callback(secretNumber);
        secretNumber = random();
        numbers = [];
      }

      UpdateNumbers();
    }
  });
};

/** @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket */
const OnDisconnection = (socket) => {
  socket.on('disconnect', (_) => {
    clients = clients.filter((e) => e.id != socket.id);
    UpdateClients();
  });
};

io.on('connection', (socket) => {
  OnConnection(socket);
  OnGuess(socket);
  OnDisconnection(socket);
});

server.listen(3000);

module.exports = io;
