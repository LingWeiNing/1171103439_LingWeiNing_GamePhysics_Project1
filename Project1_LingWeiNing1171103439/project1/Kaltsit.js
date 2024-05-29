export default class Kaltsit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'Kaltsit');
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
            duration: 3000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.burstMonsterEvent = null;
        this.shootBurstMonster(scene);
        this.lastHitTime = 0;
    }

    shootBurstMonster(scene) {
        this.burstMonsterEvent = scene.time.addEvent({
            delay: 2000, 
            callback: () => {
                const centerX = this.x;
                const centerY = this.y;
                const radius = 70;
                const numBullets = 12;
                
                const playerAngle = Phaser.Math.Angle.Between(centerX, centerY, this.player.x, this.player.y);
    
                for (let j = 0; j < numBullets; j++) {
                    const angle = Phaser.Math.PI2 * (j / numBullets);
                    const bulletX = centerX + radius * Math.cos(angle);
                    const bulletY = centerY + radius * Math.sin(angle);
                    
                    let monsterBullet = scene.physics.add.image(bulletX, bulletY, 'monster');
                    monsterBullet.setTint(0xffffff);
                    monsterBullet.body.setAllowGravity(false);
    
                    monsterBullet.setRotation(playerAngle);
                    
                    monsterBullet.setVelocity(Math.cos(playerAngle) * 300, Math.sin(playerAngle) * 300);
                    
                    monsterBullet.setCollideWorldBounds(false);
    
                    scene.physics.add.collider(monsterBullet, this.player, () => {
                        this.player.takeDamage(20);
                        monsterBullet.destroy();
                    });
                }
            },
            callbackScope: this,
            loop: true // Repeat indefinitely
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
                if (this.burstMonsterEvent) {
                    this.burstMonsterEvent.remove(false); 
                    this.burstMonsterEvent = null; 
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
            if (this.burstMonsterEvent) {
                this.burstMonsterEvent.remove(false); 
                this.burstMonsterEvent = null; 
            }
        }
    }
    
}
