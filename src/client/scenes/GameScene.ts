import Phaser from 'phaser'
import * as Colyseus from "colyseus.js";

export default class HelloWorldScene extends Phaser.Scene
{// get `roomId` from the query string
    private roomId?: string;
    private client?: Colyseus.Client; 
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private stars?: Phaser.Physics.Arcade.Group;
    private bombs?: Phaser.Physics.Arcade.Group;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    private score = 0;
    private scoreText?: Phaser.GameObjects.Text;
    private infoText?: Phaser.GameObjects.Text;

    private gameOver = false;

	constructor()
	{
		super('game-scene')
	}

    init()
    {
        // this.client = new Colyseus.Client('ws://localhost:2567');
    }

	preload()
    {
        
    }

    create()
    {

    }


    update() {
        
    }
}
