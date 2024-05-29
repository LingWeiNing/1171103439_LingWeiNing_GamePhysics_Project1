import Player from './player.js';
import ChairMaster from './chairMaster.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.bullets = null;
        this.stools = null;
        this.theGreatChairMaster = null;
        this.playerBullet = null;
        this.backgroundMusic = null;
    }

    preload() {
        this.load.image('platform', 'images/platform.png');
        this.load.spritesheet('player', 'images/bunnyDoktah.jpg', { frameWidth: 64, frameHeight: 64 });
        this.load.image('bullet', 'images/bullet.png');
        this.load.image('bg', 'images/greyBG.jpg');
        this.load.image('stool', 'images/stool.png');
        this.load.image('theGreatChairMaster', 'images/logos.png');
        this.load.audio('backgroundMusic1', 'audio/MistyMemoryNight.mp3');
        this.load.audio('hitSound', 'audio/hitSound.mp3');
        this.load.audio('hitSound2', 'audio/hitSound2.mp3');
    }

    create() {
        this.platforms = this.physics.add.staticGroup();

        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff);

        const lineY = gameHeight / 2 + 350;
        graphics.beginPath();
        graphics.moveTo(0, lineY);
        graphics.lineTo(gameWidth, lineY);
        graphics.strokePath();

        const bg = this.add.image(0, lineY, 'bg');
        bg.setOrigin(0, 0);
        bg.displayWidth = gameWidth;
        bg.displayHeight = gameHeight - lineY;

        function distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }

        const numPlatforms = 10;
        const minDistance = 50;
        const platformsPositions = [];

        for (let i = 0; i < numPlatforms; i++) {
            let x, y, validPosition;
            do {
                x = Phaser.Math.Between(200, 900);
                y = Phaser.Math.Between(200, lineY - 20);
                validPosition = true;
                for (let pos of platformsPositions) {
                    if (distance(x, y, pos.x, pos.y) < minDistance) {
                        validPosition = false;
                        break;
                    }
                }
            } while (!validPosition);

            platformsPositions.push({ x: x, y: y });

            let platform = this.platforms.create(x, y, 'platform');
            platform.body.checkCollision.up = true;
            platform.body.checkCollision.down = true;
            platform.body.checkCollision.left = true;
            platform.body.checkCollision.right = true;
        }

        this.player = new Player(this, 500, 900); 
        this.cursors = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });

        this.bullets = this.physics.add.group();
        this.stools = this.physics.add.group();

        this.input.on('pointerdown', function (pointer) {
            if (pointer.y < lineY) {
                this.playerBullet = this.shootBullet(pointer.x, pointer.y);
            }
        }, this);

        this.physics.add.collider(this.bullets, this.platforms, this.bulletPlatformCollision);

        this.theGreatChairMaster = new ChairMaster(this, 800, 100, this.player); 
        this.theGreatChairMaster.shootStools(this);

        this.physics.add.collider(this.bullets, this.theGreatChairMaster, () => {
            this.playerBullet.destroy();
            this.theGreatChairMaster.takeDamage(10);
        });

        this.backgroundMusic = this.sound.add('backgroundMusic1');
        if (!this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play({
                loop: true,
                volume: 0.2
            });
        }
    }

    shootBullet(x, y) {
        let bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
        bullet.setTint(0xffffff);
        bullet.setScale(0.05);
        bullet.body.setAllowGravity(false);

        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, x, y);
        bullet.setRotation(angle);
        bullet.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
        bullet.setCollideWorldBounds(true);
        bullet.setBounce(1);
        return bullet;
    }

    bulletPlatformCollision(bullet, platform) {
        bullet.setBounce(1);
    }

    update() {
        this.player.update(this.cursors);
        this.theGreatChairMaster.update();

        if (this.scene.isTransition) {
            this.backgroundMusic.stop();
        }

        this.bullets.children.iterate(function (bullet) {
            bullet.body.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;
            bullet.body.world.on('worldbounds', function (body) {
                if (body.gameObject === bullet && body.blocked.down) {
                    bullet.destroy();
                }
            }, this);
        }, this);
    }

    shutdown() {
        this.backgroundMusic.stop(); 
    }

    destroy() {
        this.backgroundMusic.stop();
    }
}

export default MainScene;
