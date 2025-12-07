export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemyData) {
        super(scene, x, y, enemyData.texture, enemyData.frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.enemyData = enemyData;

        this.scale = 2;

        this.health = enemyData.maxHealth ?? 100;
        this.speed = enemyData.moveSpeed ?? 100;
        this.damage = enemyData.damage ?? 1;
        this.exp = enemyData.exp ?? 1;

        this.anims.create({
            key: 'enemy_walk',
            frames: scene.anims.generateFrameNumbers(enemyData.texture, { start: enemyData.frame, end: enemyData.frame + 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.play('enemy_walk', true);
    }

    update() {
        if (this.scene.levelUpUI.isActive) {
            this.body.setVelocity(0, 0);
            return;
        }

        this.scene.physics.moveToObject(this, this.scene.player, this.speed);

        if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }
    }

    takeDamage(amount, multiplier = 1) {
        this.health -= (amount * multiplier);

        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => { this.clearTint(); });

        this.showDamageNumber((amount * multiplier));

        if (this.health <= 0) {
            this.scene.events.emit('enemyDied', this.exp);
            this.destroy();
        }
    }

    showDamageNumber(amount) {
        const damageText = this.scene.add.text(this.x, this.y - 30, `-${amount.toFixed(2)}`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);

        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 40,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });
    }
}