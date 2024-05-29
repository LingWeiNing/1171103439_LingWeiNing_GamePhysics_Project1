import StartScene from './StartScene.js';
import MainScene from './MainScene.js';
import SecondMainScene from './SecondMainScene.js';
import TutorialScene from './TutorialScene.js';
import LosingScene from './LosingScene.js';
import NextLevel from './NextLevel.js';
import WinningScene from './WinningScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            //debug: true
        }
    },
    scene: [StartScene, TutorialScene, MainScene, SecondMainScene, LosingScene, NextLevel, WinningScene],
    fps: {
        target: 40,
        forceSetTimeOut: true
    }
};

const game = new Phaser.Game(config);
