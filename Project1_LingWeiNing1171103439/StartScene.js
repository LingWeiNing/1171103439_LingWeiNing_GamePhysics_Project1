class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

  preload() {
      this.load.image('startButton', 'images/PlayButton.png');
      this.load.image('bg', 'images/greyBG.jpg');
      this.load.image('race', 'images/RaceStart.png');
  }

  create() {
      const gameWidth = this.sys.game.config.width;
      const gameHeight = this.sys.game.config.height;

      const bg = this.add.image(gameWidth / 2, gameHeight / 2, 'bg');
      bg.setOrigin(0.5, 0.5);
      bg.displayWidth = gameWidth;
      bg.displayHeight = gameHeight;

      const race = this.add.image(gameWidth / 2, gameHeight / 2 - 50, 'race');
      race.setOrigin(0.5, 0.5);
      race.displayWidth = 500;
      race.displayHeight = 300;

      this.add.text(gameWidth / 2, gameHeight / 2 - 300, ' The Great Chair Battle \n   of Rhodes Island', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

      const startButton = this.add.image(gameWidth / 2, gameHeight / 2 + 300, 'startButton').setInteractive();
      startButton.on('pointerdown', () => {
          this.scene.start('TutorialScene');
      });
  }
}

export default StartScene;