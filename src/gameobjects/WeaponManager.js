import { Weapon } from "./Weapon.js";

export class WeaponManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.weapons = [];
        this.maxWeapons = 5;

        this.projectiles = scene.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 50,
            runChildUpdate: false
        });

        scene.physics.add.overlap(this.projectiles, scene.enemies_g, this.hitEnemy, null, this);
    }

    addWeapon(weaponData) {
        if (this.weapons.length >= this.maxWeapons) {
            console.log("maximum weapons reached");
            return false;
        }

        const stats = { ...weaponData.baseStats };

        const weapon = new Weapon(this.scene, this.player, {
            ...weaponData,
            damage: stats.damage,
            cooldown: stats.cooldown,
            projectileSpeed: stats.projectileSpeed,
            range: stats.range,
            projectileSize: stats.projectileSize ?? 1
        });

        weapon.projectiles = this.projectiles;
        weapon.weaponId = weaponData.id;
        weapon.level = 1;
        weapon.maxLevel = weaponData.maxLevel;
        weapon.upgradeScaling = weaponData.upgradeScaling;
        weapon.weaponName = weaponData.name;
        weapon.setDepth(51);

        this.weapons.push(weapon);

        this.updateWeaponPosition();

        return true;
    }

    upgradeWeapon(weaponId) {
        const weapon = this.weapons.find(w => w.weaponId == weaponId);
        if (!weapon) return false;

        if (weapon.level >= weapon.maxLevel) {
            console.log('weapon already at max level');
            return false;
        }

        weapon.level++;

        weapon.damage += weapon.upgradeScaling.damage ?? 0;
        weapon.cooldown += weapon.upgradeScaling.cooldown ?? 0;
        weapon.projectileSpeed += weapon.upgradeScaling.projectileSpeed ?? 0;
        weapon.range += weapon.upgradeScaling.range ?? 0;
        weapon.weaponData.projectileSize += weapon.upgradeScaling.projectileSize ?? 0;

        console.log(`${weapon.weaponName} upgraded to level ${weapon.level}`);
        return true;
    }

    getUpgradeableWeapons() {
        return this.weapons.filter(w => w.level < w.maxLevel);
    }

    getWeaponIds() {
        return this.weapons.map(w => w.weaponId);
    }

    updateWeaponPosition() {
        const numWeapons = this.weapons.length;
        if (numWeapons == 0) return;

        const arcSpan = Math.PI * 0.8;
        const startAngle = -Math.PI / 2 - arcSpan / 2;

        for (let i = 0; i < numWeapons; i++) {
            let angle;

            if (numWeapons == 1) {
                angle = -Math.PI / 2;
            } else {
                angle = startAngle + (arcSpan / (numWeapons - 1)) * i;
            }

            this.weapons[i].setOrbitPosition(angle);
        }
    }

    update(time) {
        for (let weapon of this.weapons) {
            weapon.update(time);
        }
    }

    hitEnemy(projectile, enemy) {
        if (!projectile.active) return;

        projectile.setActive(false);
        projectile.setVisible(false);
        projectile.body.stop();

        enemy.takeDamage(projectile.damage, this.player.stats.damage);
    }
}