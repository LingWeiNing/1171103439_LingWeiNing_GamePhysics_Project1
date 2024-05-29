import Player from './player.js';
import Amiya from './Amiya.js';
import Kaltsit from './Kaltsit.js';

class SecondMainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SecondMainScene' });
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.bullets = null;
        this.stack = null;
        this.Amiya = null;
        this.monster = null;
        this.Kaltsit = null;
        this.Explosion = null;
        this.playerBullet = null;
        this.backgroundMusic = null;
    }

    preload() {
        console.log('SecondMainScene preload method called');
        this.load.image('platform', 'images/platform.png');
        this.load.spritesheet('player', 'images/bunnyDoktah.jpg', { frameWidth: 64, frameHeight: 64 });
        this.load.image('bullet', 'images/bullet.png');
        this.load.image('bg', 'images/greyBG.jpg');
        this.load.image('stack', 'images/stack.png');
        this.load.image('Amiya', 'images/bunnyAmiya.png');
        this.load.spritesheet('explosion', 'images/explosion.jpg', { frameWidth: 63, frameHeight: 65 });
        this.load.image('monster', 'images/monster.png');
        this.load.image('Kaltsit', 'images/bunnyKaltsit.png');
        //this.load.audio('backgroundMusic2', 'audio/MistyMemoryDay.mp3');
        this.load.audio('hitSound', 'audio/hitSound.mp3');
        this.load.audio('hitSound2', 'audio/hitSound2.mp3');
    }

    create() {
        console.log('SecondMainScene create method called');
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
        this.stack = this.physics.add.group();
        this.monster = this.physics.add.group();

        this.input.on('pointerdown', function (pointer) {
            if (pointer.y < lineY) {
                this.playerBullet = this.shootBullet(pointer.x, pointer.y);
            }
        }, this);

        this.physics.add.collider(this.bullets, this.platforms, this.bulletPlatformCollision);

        this.Amiya = new Amiya(this, 800, 100, this.player); 
        this.Kaltsit = new Kaltsit(this, 800, 100, this.player); 
        this.Amiya.shootStack(this);
        this.Kaltsit.shootBurstMonster(this);

        this.physics.add.collider(this.bullets, this.Amiya, () => {
            this.playerBullet.destroy();
            this.Amiya.takeDamage(10);
        });

        this.physics.add.collider(this.bullets, this.Kaltsit, () => {
            this.playerBullet.destroy();
            this.Kaltsit.takeDamage(10);
        });

        //this.backgroundMusic = this.sound.add('backgroundMusic2');
        //this.backgroundMusic.play({
            //loop: true,
            //volume: 0.2
        //});

        this.createAnimations();
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
        this.Amiya.update();
        this.Kaltsit.update();

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

    createAnimations() {
        this.anims.create({
            key: 'explosions',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });
    }

    checkWinCondition() {
        if (this.Amiya.hp <= 0 && this.Kaltsit.hp <= 0) {
            this.scene.start('WinningScene');
        }
    }

    //shutdown() {
        //this.backgroundMusic.stop(); 
    //}

    //destroy() {
        //this.backgroundMusic.stop();
    //}
}

export default SecondMainScene;
