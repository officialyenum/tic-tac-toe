import http from 'http';
import express from 'express';
import cors from "cors";
import { Server  } from 'colyseus';
import { monitor } from '@colyseus/monitor';

import TicTacToe from "./TicTacToe";

const port = Number(process.env.PORT || 2567);
const app = express()

app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const gameServer = new Server({
    server,
});

//register room handlers
gameServer.define('tic-tac-toe',TicTacToe);
app.use('/colyseus', monitor());
app.use('/test', (req, res, next) => {
    res.json({
        test: "testing"
    })
})

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);

