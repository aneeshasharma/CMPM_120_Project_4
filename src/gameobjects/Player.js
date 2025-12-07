export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);

        this.scale = 2;

        this.arrowKeys = scene.input.keyboard.createCursorKeys();
        this.wasdKeys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.level = 1;
        this.xp = 0;
        this.xpToLvl = 10;

        this.stats = {
            maxHealth: 100,
            moveSpeed: 200,
            damage: 1,
        };

        this.health = this.stats.maxHealth;

        this.invulnerable = false;
        this.invulTime = 250;

        this.anims.create({
            key: 'player_walk',
            frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
    }

    update() {
        this.velocityMove();
        this.moving();
    }

    velocityMove() {
        this.body.setVelocity(0);

        if (this.arrowKeys.up.isDown || this.wasdKeys.up.isDown) {
            this.body.setVelocityY(-this.stats.moveSpeed);
        }
        if (this.arrowKeys.down.isDown || this.wasdKeys.down.isDown) {
            this.body.setVelocityY(this.stats.moveSpeed);
        }
        if (this.arrowKeys.left.isDown || this.wasdKeys.left.isDown) {
            this.body.setVelocityX(-this.stats.moveSpeed);
            this.setFlipX(true);
        }
        if (this.arrowKeys.right.isDown || this.wasdKeys.right.isDown) {
            this.body.setVelocityX(this.stats.moveSpeed);
            this.setFlipX(false);
        }
    }

    moving() {
        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            this.anims.play('player_walk', true);
        } else {
            this.anims.stop();
            this.setFrame(0);
        }
    }

    takeDamage(amount) {
        if (this.invulnerable) return;

        this.invulnerable = true;
        this.health -= amount;
        console.log(`hp: ${this.health}`);

        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => { this.clearTint(); });

        this.showDamageNumber(amount);

        this.scene.time.delayedCall(this.invulTime, () => this.invulnerable = false);
    }

    showDamageNumber(amount) {
        const damageText = this.scene.add.text(this.x, this.y - 30, `-${amount.toFixed(2)}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);

        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 50,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });
    }

    addXP(amount) {
        this.xp += amount;
        console.log(`xp: ${this.xp}`);

        if (this.xp >= this.xpToLvl) {
            this.xp -= this.xpToLvl;
            this.level++;
            this.xpToLvl = Math.floor(this.xpToLvl * 1.25);

            this.scene.events.emit('playerLevelUp');
            console.log(`level up! now level ${this.level}`);
        }
    }
}