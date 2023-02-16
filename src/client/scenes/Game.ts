import Phaser from 'phaser'
import * as Colyseus from "colyseus.js";
import type Server from '../services/Server';
import { ITicTacToeState, IGameOverSceneData, IGameSceneData, Cell, GameState } from '../../types';

export class Game extends Phaser.Scene
{

    private server?: Server
    private onGameOver?: (data: IGameOverSceneData) => void
    private gameStateText?: Phaser.GameObjects.Text
    private cells: {display:Phaser.GameObjects.Sprite, value: Cell }[] = []
    private background?: Phaser.GameObjects.Sprite
    private turnTile?: Phaser.GameObjects.Sprite

	constructor()
	{
		super('game')
	}

	preload()
    {

        this.load.multiatlas('tic-tac-toe', 'assets/tic-tac-toe.json', 'assets');  
    }

    async create(data: IGameSceneData)
    {
        const { server, onGameOver } = data
        
        this.server = server;
        this.onGameOver = onGameOver
        if (!this.server) {
            throw new Error('server instance missing');
        }
        await this.server.join();

        this.server.onceStateChanged(this.createBoard, this)
    }

    private createBoard(state: ITicTacToeState) 
    {
        const { width, height } = this.scale;
        const size = 64;
        const vWidth = (width * 0.5) - size;
        const vHeight = (height * 0.5) - size;
        let x = vWidth;
        let y = vHeight;
        this.background = this.add.sprite(0, 0, 'tic-tac-toe', 'background.png').setScale(1.5,1.3).setAlpha(0.1,0.2,0.8,1);
        state.board.forEach((cellState,idx) => {
            const cell = this.add.sprite(x, y, 'tic-tac-toe', 'tile.png').setScale(2, 2)
                .setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.server?.makeSelection(idx);
            })
            switch (cellState) {
                case Cell.X:
                {
                    this.add.sprite(cell.x, cell.y, 'tic-tac-toe', 'x.png').setScale(2, 2)
                    break;
                }
                case Cell.O:
                {
                    this.add.sprite(cell.x, cell.y, 'tic-tac-toe', 'o.png').setScale(2, 2)
                    break;
                }
            }
            this.cells?.push({
                display: cell,
                value: cellState
            });
            
            x += size + 5
            if ((idx + 1) % 3 === 0) {
                y += size + 5
                x = vWidth
            }
        });

        if (this.server?.gameState === GameState.WaitingForPlayers) {
            const width = this.scale.width;
            this.gameStateText = this.add.text(width * 0.5, 50,'Waiting for opponent...')
                .setOrigin(0.5)
        }
        this.turnTile = this.add.sprite(width * 0.5, 100, 'tic-tac-toe', 'x.png')
        this.server?.onBoardChanged(this.handleBoardChanged, this)
        this.server?.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
        this.server?.onPlayerWin(this.handlePlayerWin, this);
        this.server?.onGameStateChanged(this.handleGameStateChange, this);
    }

    private handleBoardChanged(item: Cell, key:number) 
    {
        
        const cell = this.cells[key].display as any

        switch (item) {
            case Cell.X:
            {
                this.add.sprite(cell.x, cell.y, 'tic-tac-toe', 'x.png').setScale(2, 2)
                break;
            }
            case Cell.O:
            {
                this.add.sprite(cell.x, cell.y, 'tic-tac-toe', 'o.png').setScale(2, 2)
                break;
            }
        }

        this.cells[key] = {
            display: cell,
            value: item
        }

    }

    private handlePlayerTurnChanged(playerIndex: number)
    {
        this.clearGameText()
        const { width } = this.scale;
        if(this.server?.playerIndex === -1)
        {
            return
        }else if(playerIndex == 0){
            this.turnTile?.setFrame('x.png');
        }else{
            this.turnTile?.setFrame('o.png');
        }
        if (this.server?.playerIndex === playerIndex) {
            console.log("my turn");
            this.gameStateText = this.add.text(width * 0.5, 50,'Your Turn')
                .setOrigin(0.5)
        }else{
            console.log("opponent turn");
            this.gameStateText = this.add.text(width * 0.5, 50,'Waiting for opponent...')
                .setOrigin(0.5)
        }
    }

    private handlePlayerWin(playerIndex: number)
    {
        this.time.delayedCall(1000, () => {
			if (!this.onGameOver)
			{
				return
			}

			this.onGameOver({
				winner: this.server?.playerIndex === playerIndex,
                onRestart: () => {}
			})
		})
    }

    private  handleGameStateChange(state: GameState)
    {
        if (state === GameState.Playing && this.gameStateText) {
            this.clearGameText()
        }
    }

    private clearGameText()
    {
        this.gameStateText?.destroy()
        this.gameStateText = undefined;
    }
}
