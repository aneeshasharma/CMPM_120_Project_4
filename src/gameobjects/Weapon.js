export class Weapon extends Phaser.GameObjects.Sprite {
    constructor(scene, player, weaponData) {
        super(scene, 0, 0, weaponData.texture, weaponData.frame)

        scene.add.existing(this);

        this.player = player
        this.weaponData = weaponData

        this.damage = weaponData.damage ?? 10;
        this.cooldown = weaponData.cooldown ?? 1000;
        this.projectileSpeed = weaponData.projectileSpeed ?? 300;
        this.range = weaponData.range ?? 400;

        this.orbitAngle = 0;
        this.orbitDistance = 40;

        this.scale = 2;

        this.lastFired = 0;
        this.canFire = true;

        this.projectiles = null;
    }

    update(time) {
        this.x = Math.round(this.player.x + Math.cos(this.orbitAngle) * this.orbitDistance);
        this.y = Math.round(this.player.y + Math.sin(this.orbitAngle) * this.orbitDistance);

        if (this.canFire && time > this.lastFired + this.cooldown) {
            this.fireAtNearestEnemy(time);
        }
    }

    fireAtNearestEnemy(time) {
        const enemies = this.scene.enemies_g.getChildren();
        if (enemies.length == 0) return;

        let nearestEnemy = null;
        let nearestDistance = this.range;

        for (let enemy of enemies) {
            const enemyCenterX = enemy.body ? enemy.body.center.x : enemy.x;
            const enemyCenterY = enemy.body ? enemy.body.center.y : enemy.y;

            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemyCenterX, enemyCenterY);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        }

        if (nearestEnemy) {
            this.fireProjectile(nearestEnemy);
            this.lastFired = time;
        }
    }

    fireProjectile(target) {
        const projectile = this.projectiles.get(this.x, this.y, this.weaponData.projectileTexture, this.weaponData.projectileFrame);

        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.scale = 1;
            projectile.body.setCircle(5);
            projectile.damage = this.damage;

            const targetX = target.body ? target.body.center.x : target.x;
            const targetY = target.body ? target.body.center.y : target.y;

            const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);

            projectile.setRotation(angle + Math.PI / 2);

            this.scene.physics.velocityFromRotation(angle, this.projectileSpeed, projectile.body.velocity);

            if (projectile.destroyTimer) projectile.destroyTimer.remove();

            projectile.destroyTimer = this.scene.time.delayedCall(5000, () => {
                if (projectile.active) {
                    projectile.setActive(false);
                    projectile.setVisible(false);
                    projectile.body.stop();
                }
            });
        }
    }

    setOrbitPosition(angle) {
        this.orbitAngle = angle;
    }
}