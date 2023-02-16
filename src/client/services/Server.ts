import  { Client, Room } from 'colyseus.js';
import Phaser from 'phaser';
import { ITicTacToeState, Cell, Message } from '../../types'

export default class Server
{
    private client:  Client;
    private events: Phaser.Events.EventEmitter
    private room?: Room<ITicTacToeState>
    private _playerIndex = -1

    get playerIndex()
    {
        return this._playerIndex;
    }
    constructor()
    {
        this.client = new Client('ws://localhost:2567')
        this.events = new Phaser.Events.EventEmitter();
    }

    async join()
    {
        this.room = await this.client.joinOrCreate<ITicTacToeState>("tic-tac-toe");
        
        this.room.onMessage(Message.PlayerIndex, (message: { playerIndex: number }) => {
            this._playerIndex = message.playerIndex;
        });

        this.room.onStateChange.once(state => {
            this.events.emit('once-state-changed', state)
        })
        this.room.state.onChange = (changes) => {
            changes.forEach(change => {
                const { field, value} = change;
                switch (field) 
                {
					case 'activePlayer':
						this.events.emit('player-turn-changed', value)
						break

					case 'winningPlayer':
						this.events.emit('player-win', value)
                        break;
                }
            })
        }

        this.room.state.board.onChange = (item: Cell, key: number) => {
            this.events.emit('board-changed', item, key)
        }
    }

    leave() {
        this.room?.leave()
        this.events.removeAllListeners()
    }

    makeSelection(idx: number)
    {
        if (!this.room) 
        {
            return
        }

        if (this.playerIndex !== this.room.state.activePlayer) {
            console.warn('not this player\'s turn');
            return
        }

        this.room.send(Message.PlayerSelection, {
            index: idx
        });

    }

    onceStateChanged(cb: (state: ITicTacToeState) => void, context?: any)
    {
        this.events.once('once-state-changed', cb, context)
    }

    onBoardChanged(cb: (cell: number, index: number) => void, context?: any)
    {
        this.events.on('board-changed', cb, context)
    }

    onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any)
    {
        this.events.on('player-turn-changed', cb, context)
    }

    onPlayerWin(cb: (playerIndex: number) => void, context?: any)
    {
        this.events.on('player-win', cb, context)
    }
}