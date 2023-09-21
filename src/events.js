const random = () => 1 + Math.floor(Math.random() * 100);

let clients = [];
let numbers = [];
let secretNumber = random();

/** @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io */
const UpdateClients = (io) =>
  io.emit(
    'update-clients',
    clients.sort((a, b) => b.score - a.score)
  );

/** @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io */
const UpdateNumbers = (io) =>
  io.emit(
    'numbers',
    numbers.sort((a, b) => a - b)
  );

/**
 *  @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 *  @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket
 */
const OnConnection = (io, socket) => {
  const name = socket.handshake.query.name;

  if (name.length < 3 || name.length > 25) {
    socket.disconnect();
    return;
  }

  clients.push({ name, id: socket.id, score: 0 });

  UpdateClients(io);
  UpdateNumbers(io);
};

const IsValid = (number) =>
  !Number.isNaN(number) &&
  number >= 1 &&
  number <= 100 &&
  !numbers.includes(number);

/**
 *  @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 *  @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} socket
 */
const OnGuess = (io, socket) => {
  socket.on('guess', (data, callback) => {
    if (IsValid(data)) {
      numbers.push(data);

      if (secretNumber == data) {
        const client = clients.find((e) => e.id == socket.id);
        client.score++;

        UpdateClients(io);

        socket.broadcast.emit('target', { name: client.name, secretNumber });
        callback(secretNumber);
        secretNumber = random();
        numbers = [];
      }

      UpdateNumbers(io);
    }
  });
};

/**
 * @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 * @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} scoket
 */
const OnDisconnection = (io, socket) => {
  socket.on('disconnect', (_) => {
    clients = clients.filter((e) => e.id != socket.id);
    UpdateClients(io);
  });
};

/**
 * @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 */
const config = (io) => {
  io.on('connection', (socket) => {
    OnConnection(io, socket);
    OnGuess(io, socket);
    OnDisconnection(io, socket);
  });
};

module.exports = config;
