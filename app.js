import { createServer } from 'http';
import express from 'express';

const app = express();
const server = createServer(app);

app.use(express.static('public'));

export default server;
