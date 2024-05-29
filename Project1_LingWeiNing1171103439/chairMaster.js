export default class ChairMaster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'theGreatChairMaster');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;

        this.setCollideWorldBounds(true);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.hp = 70;

        this.hpText = scene.add.text(this.x, this.y - 50, `HP: ${this.hp}`, { fontSize: '16px', fill: '#fff' });
        this.hpText.setOrigin(0.5, 0.5);

        this.initialY = y; 
        this.hitSound2 = scene.sound.add('hitSound2');

        console.log('Creating ChairMaster');

        this.moveTween = scene.tweens.add({
            targets: this,
            x: { from: x, to: 200 }, 
            duration: 3000,
            ease: 'Linear',
            yoyo: true, 
            repeat: -1,
            onYoyo: this.onTweenYoyo,
            onYoyoScope: this,
            onComplete: this.onTweenComplete,
            onCompleteScope: this
        });

        this.shootStools(scene);
        this.shootDiagonalStools(scene);
        this.shootBurstStools(scene);
        this.lastHitTime = 0; 
    }

    onTweenYoyo(tween, target) {
        console.log('Yoyo event triggered', target.x);
    }

    onTweenComplete(tween, targets) {
        console.log('Tween complete', targets);
    }

    shootStools(scene) {
        scene.time.addEvent({
            delay: 2000, 
            callback: () => {
                if (!this.player) {
                    console.log('Player is not defined');
                    return; 
                }

                console.log('Shooting stool');
                let stool = scene.physics.add.image(this.x, this.y, 'stool');
                stool.setTint(0xffffff);
                stool.body.setAllowGravity(false);

                let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                stool.setRotation(angle);

                const speed = 300; 
                stool.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

                stool.setCollideWorldBounds(false);

                this.scene.physics.add.collider(stool, this.player, () => {
                    stool.destroy();
                    this.player.takeDamage(10);
                });
            },
            callbackScope: this,
            loop: true
        });
    }

    shootDiagonalStools(scene) {
        scene.time.addEvent({
            delay: 8000,
            callback: () => {
                if (!this.player) {
                    console.log('Player is not defined');
                    return; 
                }

                console.log('Shooting diagonal stools');
                const stoolDirections = [
                    { angleOffset: -Math.PI / 8 },
                    { angleOffset: 0 },           
                    { angleOffset: Math.PI / 8 }  
                ];

                stoolDirections.forEach(direction => {
                    let stool = scene.physics.add.image(this.x, this.y, 'stool');
                    stool.setTint(0xffffff);
                    stool.body.setAllowGravity(false);

                    let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y) + direction.angleOffset;
                    stool.setRotation(angle);

                    const speed = 300; 
                    stool.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

                    stool.setCollideWorldBounds(false);

                    this.scene.physics.add.collider(stool, this.player, () => {
                        stool.destroy();
                        this.player.takeDamage(10);
                    });
                });
            },
            callbackScope: this,
            loop: true
        });
    }

    shootBurstStools(scene) {
        scene.time.addEvent({
            delay: 5000, 
            callback: () => {
                if (!this.player) {
                    console.log('Player is not defined');
                    return; 
                }

                const burstShoot = () => {
                    for (let i = 0; i < 7; i++) {
                        scene.time.addEvent({
                            delay: i * 150, 
                            callback: () => {
                                if (!this.player) {
                                    console.log('Player is not defined');
                                    return; 
                                }

                                console.log('Shooting burst stool');
                                let stool = scene.physics.add.image(this.x, this.y, 'stool');
                                stool.setTint(0xffffff);
                                stool.body.setAllowGravity(false);

                                let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                                stool.setRotation(angle);

                                const speed = 300; 
                                stool.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

                                stool.setCollideWorldBounds(false);

                                this.scene.physics.add.collider(stool, this.player, () => {
                                    stool.destroy();
                                    this.player.takeDamage(10);
                                });
                            },
                            callbackScope: this
                        });
                    }
                };

                burstShoot();
            },
            callbackScope: this,
            loop: true
        });
    }

    takeDamage(damage) {
        const currentTime = this.scene.time.now; 
        if (currentTime - this.lastHitTime >= 3000) { 
            if (this.hp > 0) {
                this.hp -= damage;
            }
            if (this.hp <= 0) {
                this.hp = 0;
                this.scene.scene.start('NextLevel');
            }
            this.hpText.setText(`HP: ${this.hp}`);
            this.lastHitTime = currentTime; // Update the last hit time
            this.hitSound2.play();
        }
    }

    update() {
        this.hpText.setPosition(this.x, this.y - 50);
        this.y = this.initialY;
    }
}
