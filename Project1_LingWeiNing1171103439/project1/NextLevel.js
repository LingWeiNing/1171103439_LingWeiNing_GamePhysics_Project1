export default class NextLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'NextLevel' });
    }
  
    preload() {
        this.load.image('NextLevelButton', 'images/NextLevelButton.png');
        this.load.image('bg', 'images/greyBG.jpg');
        this.load.image('win', 'images/Winning.jpg');
    }
  
    create() {
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
  
        this.add.text(gameWidth / 2, gameHeight / 2 - 300, '     You Win! \n  You are now the \n   Chair Master! ', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
  
        const startButton = this.add.image(gameWidth / 2, gameHeight / 2 + 300, 'NextLevelButton').setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('SecondMainScene');
        });
    }
  }
  