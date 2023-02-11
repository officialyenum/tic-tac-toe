import 'regenerator-runtime/runtime';
import Phaser, { CANVAS } from 'phaser'

import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		}
	},
	scale: {
		parent: 'canvas',
		autoCenter: Phaser.Scale.Center.CENTER_BOTH,	
		width: 800,
		height: 600,
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)
