import Phaser from "phaser";    
import { IGameOverSceneData } from "../../types";

export class GameOver extends Phaser.Scene{

    private onRestart?: () => void

    constructor()
    {
        super('game-over')
    }

    create(data: IGameOverSceneData)
    {

        const { winner, onRestart } = data
        const  text = winner ? 'You Won!' : 'You Lost!';
        this.onRestart = onRestart

        const { width, height } = this.scale

        const title = this.add.text(width * 0.5, height* 0.5, text,{
            fontSize: '48px'
        }).setOrigin(0.5)

        this.add.text(title.x, title.y + 100, 'Press space to play again',{
            fontSize: '12px'
        }).setOrigin(0.5)

        this.input.keyboard.once('keyup-SPACE', () => {
            if(this.onRestart){
                this.onRestart()
            }
        })
    }
}