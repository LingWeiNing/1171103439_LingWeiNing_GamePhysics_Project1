export default class Amiya extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'Amiya');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.setCollideWorldBounds(true);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.hp = 40;

        this.hpText = scene.add.text(this.x, this.y - 50, `HP: ${this.hp}`, { fontSize: '16px', fill: '#fff' });
        this.hpText.setOrigin(0.5, 0.5);
        this.initialY = y;
        this.hitSound2 = scene.sound.add('hitSound2');

        this.moveTween = scene.tweens.add({
            targets: this,
            x: { from: x, to: 200 },
            duration: 6000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.stackEvent = null; 

        this.shootStack(scene);
        this.lastHitTime = 0;
    }

    shootStack(scene) {
        this.stackEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                if (!this.player) return;

                let stack = scene.physics.add.image(this.x, this.y, 'stack');
                stack.setTint(0xffffff);
                stack.body.setAllowGravity(false);

                let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                stack.setRotation(angle);
                stack.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
                stack.setCollideWorldBounds(true);
                stack.setBounce(1);

                scene.physics.add.collider(stack, this.player, () => {
                    this.player.takeDamage(10);
                    stack.destroy();
                });
                scene.time.delayedCall(9000, () => {
                    if (stack.active) {
                        stack.destroy();
                    }
                });
            },
            callbackScope: this,
            loop: true
        });
    }

    takeDamage(damage) {
        const currentTime = this.scene.time.now; 
        if (currentTime - this.lastHitTime >= 1500) {
            if (this.hp > 0) {
                this.hp -= damage;
            }
            if (this.hp <= 0) {
                this.hp = 0;
                if (this.stackEvent) {
                    this.stackEvent.remove(false); 
                    this.stackEvent = null; 
                }
            }
            this.hpText.setText(`HP: ${this.hp}`);
            this.lastHitTime = currentTime; 
            this.hitSound2.play();
            this.scene.checkWinCondition(); 
        }
    }
    

    update() {
        if (this.hp > 0) {
            this.hpText.setPosition(this.x, this.y - 50);
        } else {
            if (this.moveTween.isPlaying()) {
                this.moveTween.stop();
            }
            // Stop shooting stack
            if (this.stackEvent) {
                this.stackEvent.remove(false); // Remove the event without destroying it
                this.stackEvent = null; // Reset the event reference
            }
        }
    }
}
