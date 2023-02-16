// Import demo room handlers
import { Dispatcher } from '@colyseus/command'
import { Room, Client } from 'colyseus'
import { GameState, Message } from '../types'
import PlayerSelectionCommand from './commands/PlayerSelectionCommands'
import TicTacToeState from "./TicTacToeState"

export default class TicTacToe extends Room<TicTacToeState> {

    private dispatcher = new Dispatcher(this)
    
    onCreate()
    {
        this.maxClients = 2;
        this.setState(new TicTacToeState())

        this.onMessage(Message.PlayerSelection, (client, message: {index: number}) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                index: message.index
            })
        })
    }

    onJoin(client: Client) {
        const idx = this.clients.findIndex(c => c.sessionId === client.sessionId)
		client.send(Message.PlayerIndex, { playerIndex: idx })  
        if (this.clients.length >= 2) {
            this.state.gameState = GameState.Playing;
            this.lock()
        }  
    }
}