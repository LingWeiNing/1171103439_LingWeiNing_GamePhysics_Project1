export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, chairMaster, stools) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.allowGravity = false;
        this.hp = 20;

        this.chairMaster = chairMaster;
        this.stools = stools;

        this.hpText = scene.add.text(this.x, this.y - 50, `HP: ${this.hp}`, { fontSize: '16px', fill: '#fff' });
        this.hpText.setOrigin(0.5, 0.5);

        this.createAnimations(scene);

        this.lastHitTime = 0; 

        this.hitSound = scene.sound.add('hitSound'); 
    }

    createAnimations(scene) {
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'backRun',
            frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update(cursors) {
        if (cursors.left.isDown && this.x > 0) {
            this.setVelocityX(-160);
            this.anims.play('run', true);
            this.flipX = true;
        } else if (cursors.right.isDown && this.x < this.scene.sys.game.config.width) {
            this.setVelocityX(160);
            this.anims.play('run', true);
            this.flipX = false;
        } else {
            this.setVelocityX(0);
            this.anims.play('backRun', true);
        }

        if (cursors.up.isDown && this.y > this.scene.sys.game.config.height / 2 + 350) {
            this.setVelocityY(-160);
            this.anims.play('backRun', true);
        } else if (cursors.down.isDown && this.y < this.scene.sys.game.config.height) {
            this.setVelocityY(160);
            this.anims.play('run', true);
        } else {
            this.setVelocityY(0);
        }

        this.hpText.setPosition(this.x, this.y - 50);
    }

    takeDamage(damage) {
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastHitTime >= 1000) { 
            if (this.hp > 0) {
                this.hp -= damage;
            }
            if (this.hp <= 0) {
                this.hp = 0;
                this.scene.scene.start('LosingScene');
            }
            this.hpText.setText(`HP: ${this.hp}`);
            this.lastHitTime = currentTime;
            this.hitSound.play(); 
        }
    }
}
