const { Server } = require('socket.io');
const server = require('./app.js');

const io = new Server(server);

const random = () => 1 + Math.floor(Math.random() * 100);

let clients = [];
let numbers = [];
let secretNumber = random();

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

          secretNumber = random();
          numbers = [];
        }

        io.emit(
          'numbers',
          numbers.sort((a, b) => a - b)
        );
      }
    }
  });
  1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100;

  socket.on('disconnect', (e) => {
    clients = clients.filter((e) => e.id != socket.id);
    io.emit('update-clients', clients);
  });
});

server.listen(3000);

module.exports = io;
