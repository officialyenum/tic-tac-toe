import 'regenerator-runtime/runtime';
import Phaser from 'phaser'

import { Bootstrap, Game, GameOver } from './scenes'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scale: {
		parent: 'canvas',
		autoCenter: Phaser.Scale.Center.CENTER_BOTH,	
		width: 300,
		height: 450,
	},
	scene: [Bootstrap, Game, GameOver]
}

export default new Phaser.Game(config)
