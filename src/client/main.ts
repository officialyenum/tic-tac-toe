import 'regenerator-runtime/runtime';
import Phaser from 'phaser'

import Bootstrap from './scenes/Bootstrap'
import Game from './scenes/Game';

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
		width: 600,
		height: 600,
	},
	scene: [Bootstrap, Game]
}

export default new Phaser.Game(config)
