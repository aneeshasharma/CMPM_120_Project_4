import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'DUST HUNTERS',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: true,
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 },
            fixedStep: false
        }
    }
}

new Phaser.Game(config);
            