// Import demo room handlers
import { Dispatcher } from '@colyseus/command'
import { Room, Client } from 'colyseus'
import { Message } from '../types/message'
import PlayerSelectionCommand from './commands/PlayerSelectionCommands'
import TicTacToeState from "./TicTacToeState"

export default class TicTacToe extends Room<TicTacToeState> {

    private dispatcher = new Dispatcher(this)
    
    onCreate()
    {
        this.setState(new TicTacToeState())

        this.onMessage(Message.PlayerSelection, (client, message: {index: number}) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                index: message.index
            })
        })
    }

    onJoin(client: Client) {
        console.log(this.clients.length);
        const idx = this.clients.findIndex(c => c.sessionId === client.sessionId)
        console.log(client.sessionId);
		client.send(Message.PlayerIndex, { playerIndex: idx })    
    }

    // onDispose() {
    //     this.dispatcher.stop();
    // }
}