const { Server } = require('socket.io');
const server = require('./app.js');

const io = new Server(server);

let clients = [];
let numbers = [];
let secretNumber = 1 + Math.floor(Math.random() * 100 - 1);

io.on('connection', (socket) => {
  const name = socket.handshake.query.name;

  if (name.length < 3 || name.length > 25) {
    socket.disconnect();
    return;
  }

  clients.push({ name, id: socket.id, score: 0 });
  io.emit('update-clients', clients);

  socket.emit(
    'numbers',
    numbers.sort((a, b) => a - b)
  );

  socket.on('guess', (data) => {
    if (!Number.isNaN(data)) {
      if (data >= 1 && data <= 100 && !numbers.includes(data)) {
        numbers.push(data);

        if (secretNumber == data) {
          const client = clients.find((e) => e.id == socket.id);
          client.score++;
          clients.sort((a, b) => b.score - a.score);

          io.emit('update-clients', clients);

          secretNumber = 1 + Math.floor(Math.random() * 100 - 1);
          numbers = [];
        }

        io.emit(
          'numbers',
          numbers.sort((a, b) => a - b)
        );
      }
    }
  });

  socket.on('disconnect', (e) => {
    clients = clients.filter((e) => e.id != socket.id);
    io.emit('update-clients', clients);
  });
});

server.listen(3000);

module.exports = io;
