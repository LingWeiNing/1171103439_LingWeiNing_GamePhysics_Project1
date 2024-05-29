export default class WinningScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinningScene' });
    }

    preload() {
        console.log('WinningLevel preload method called');
        this.load.image('NewGameButton', 'images/MenuButton.png');
        this.load.image('bg', 'images/greyBG.jpg');
        this.load.image('win', 'images/doktahWinning.jpg');
    }

    create() {
        console.log('WinningLevel create method called');
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        const bg = this.add.image(gameWidth / 2, gameHeight / 2, 'bg');
        bg.setOrigin(0.5, 0.5);
        bg.displayWidth = gameWidth;
        bg.displayHeight = gameHeight;

        const win = this.add.image(gameWidth / 2, gameHeight / 2 - 50, 'win');
        win.setOrigin(0.5, 0.5);
        win.displayWidth = 500;
        win.displayHeight = 300;

        this.add.text(gameWidth / 2, gameHeight / 2 - 300, 'You Win!', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        const startButton = this.add.image(gameWidth / 2, gameHeight / 2 + 300, 'NewGameButton').setInteractive();
        startButton.on('pointerdown', () => {
            console.log('Starting MainScene from WinningLevel');
            this.scene.start('StartScene');
        });
    }
}
