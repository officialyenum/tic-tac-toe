import Phaser from 'phaser'
import * as Colyseus from "colyseus.js";
import Server from '../services/Server';
import { IGameOverSceneData } from '../../types/scenes';

export default class Bootstrap extends Phaser.Scene
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
        this.scene.launch('game', {
            server: this.server,
            onGameOver: (data: IGameOverSceneData) => {
                this.scene.stop('game');
                this.scene.launch('game-over', data)
            }
        });        
    }


    update() {
        
    }
}
