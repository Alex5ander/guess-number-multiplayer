const { Server } = require('socket.io');
const server = require('./app.js');
const config = require('./events.js');

const io = new Server(server);

config(io);

server.listen(3000, () =>
  console.log('** Server is started in http://localhost:3000 ***')
);

module.exports = io;
