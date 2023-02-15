import Phaser from 'phaser'
import * as Colyseus from "colyseus.js";
import type Server from '../services/Server';
import ITicTacToeState from '~/types/ITicTacToeState';
import { Cell } from "../../types/ITicTacToeState";

export default class Game extends Phaser.Scene
{

    private server?: Server
    private cells: {display:Phaser.GameObjects.Rectangle, value: Cell }[] = []

	constructor()
	{
		super('game')
	}

	preload()
    {
        
    }

    async create(data: {  server:Server})
    {
        const { server } = data
        
        this.server = server;
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
        state.board.forEach((cellState,idx) => {
            const cell = this.add.rectangle(x,  y, size, size, 0xffffff)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.server?.makeSelection(idx);
            })
            switch (cellState) {
                case Cell.X:
                {
                    this.add.star(cell.x, cell.y, 4, 4, 32, 0xff0000).setAngle(45)
                    break;
                }
                case Cell.O:
                {
                    this.add.circle(cell.x, cell.y, 30, 0x0000ff)
                    break;
                }
            }
            this.cells.push({
                display: cell,
                value: cellState
            });
            
            x += size + 5
            if ((idx + 1) % 3 === 0) {
                y += size + 5
                x = vWidth
            }
        });

        this.server?.onBoardChanged(this.handleBoardChanged, this)
        this.server?.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
    }

    private handleBoardChanged(item: Cell, key:number) 
    {
        
        const cell = this.cells[key].display as any
        console.log(cell);

        switch (item) {
            case Cell.X:
            {
                this.add.star(cell.x, cell.y, 4, 4, 32, 0xff0000).setAngle(45)
                break;
            }
            case Cell.O:
            {
                this.add.circle(cell.x, cell.y, 30, 0x0000ff)
                break;
            }
        }

        this.cells[key] = {
            display: cell,
            value: item
        }


        
        // for (let i = 0; i < board.length; i++) {
        //     const cell = this.cells[i];
        //     if(cell.value !== board[i]){
        //         this.add.star(cell.display.x, cell.display.y, 4, 4, 32, 0xff0000).setAngle(45)
        //         cell.value = board[i];
        //     }
        // }
    }

    private handlePlayerTurnChanged(playerIndex: number)
    {
        console.log("player index : "+ playerIndex);
        
    }
}