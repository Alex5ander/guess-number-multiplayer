const { createServer } = require('http');
const express = require('express');

const app = express();
const server = createServer(app);

app.use(express.static('public'));

module.exports = server;
