import Phaser from 'phaser'
import * as Colyseus from "colyseus.js";
import Server from '../services/Server';
import { IGameOverSceneData, IGameSceneData } from '../../types';

export class Bootstrap extends Phaser.Scene
{
    private server!: Server
	constructor()
	{
		super('bootstrap')
	}

    init()
    {
        this.server = new Server();
    }

	preload()
    {
        
    }

    create()
    {
        this.createNewGame();       
    }

    private handleGameOver = (data: IGameOverSceneData) => {
        this.server.leave();
        this.scene.stop('game');

        this.scene.launch('game-over',{
            ...data,
            onRestart: this.handleRestart
        })
    }

    private handleRestart = () => {
        this.scene.stop('game-over');
        this.createNewGame();
    }

    private createNewGame() 
    {
        this.scene.launch('game', {
            server: this.server,
            onGameOver: this.handleGameOver
        });
    }


    update() {
        
    }
}
