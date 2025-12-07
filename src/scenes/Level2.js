import { Player } from '../gameobjects/Player.js';
import { WeaponManager } from '../gameobjects/WeaponManager.js';
import { LevelUpUI } from '../gameobjects/LevelUpUI.js';
import { WEAPON_DATA, getRandomWeaponChoices } from '../gameobjects/WeaponData.js';
import { EnemyManager } from '../gameobjects/EnemyManager.js';
import { ENEMY_DATA } from '../gameobjects/EnemyData.js';
import { GameTimer } from '../gameobjects/GameTimer.js';

export default class Level2 extends Phaser.Scene {
    constructor() {
        super("Level2");
        this.lastUpgradeType = null;
    }

    preload() {
        this.load.image("background2", "assets/bg.png");
        this.load.image("bullet", "assets/PNG/Interface/Tiles/tile_0058.png");
        this.load.spritesheet("tilesheet_p", "assets/PNG/Players/Tilemap/tilemap.png", { frameWidth: 24, frameHeight: 24, spacing: 1 });
        this.load.spritesheet("tilesheet_e", "assets/PNG/Enemies/Tilemap/tilemap.png", { frameWidth: 24, frameHeight: 24, spacing: 1 });
        this.load.spritesheet("tilesheet_i", "assets/PNG/Interface/Tilemap/tilemap.png", { frameWidth: 16, frameHeight: 16, spacing: 1 });
        this.load.spritesheet("tilesheet_w", "assets/PNG/Weapons/Tilemap/tilemap.png", { frameWidth: 24, frameHeight: 24, spacing: 1 });
    }

    create() {
        this.background = this.add.sprite(640, 360, "background2");
        this.player = new Player(this, 640, 500, "tilesheet_p", 0);
        this.player.body.setCircle(11, 1, 3);
        this.cameras.main.startFollow(this.player, true);

        this.enemies_g = this.physics.add.group({ runChildUpdate: true });
        this.physics.add.collider(this.enemies_g, this.enemies_g);
        this.physics.add.collider(this.player, this.enemies_g, (p, e) => {
            e.takeDamage(e.damage); 
            this.player.takeDamage(e.damage);
        });

        this.weaponManager = new WeaponManager(this, this.player);
        this.levelUpUI = new LevelUpUI(this);
        this.enemyManager = new EnemyManager(this, this.enemies_g);
        this.gameTimer = new GameTimer(this);

        this.events.on("playerLevelUp", this.onPlayerLevelUp, this);
        this.events.on("enemyDied", (xp) => this.player.addXP(xp));

        this.gameTimer.start();
        this.gameTimer.setEndGameTime(480);
        this.weaponManager.addWeapon(WEAPON_DATA.pistol);
        this.enemyManager.spawnEnemy(ENEMY_DATA.basic);
        this.setupLevel2Spawns();

        this.gameTimer.events.on("gameEnd", () => {
            console.log("LEVEL 2 COMPLETE!");
            this.cameras.main.fade(1000);
            this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("Start"));
        });
    }

    update(time) {
        if (this.levelUpUI.isActive) { 
            this.player.body.setVelocity(0, 0); 
            return; 
        }
        this.player.update(); 
        this.weaponManager.update(time); 
        this.gameTimer.update();
    }

    setupLevel2Spawns() {
        this.gameTimer.addSpawnEvent(0, () => this.enemyManager.spawnEnemy(ENEMY_DATA.basic), true);
        this.gameTimer.addSpawnEvent(30, () => this.enemyManager.spawnEnemy(ENEMY_DATA.fast, 3), true);
        this.gameTimer.addSpawnEvent(90, () => this.enemyManager.spawnEnemy(ENEMY_DATA.swarm, 8));
        this.gameTimer.addSpawnEvent(150, () => this.enemyManager.spawnEnemy(ENEMY_DATA.brute, 1), true);
    }

    onPlayerLevelUp() {
        const upgradeType = this.lastUpgradeType === "weapon" ? "player" : "weapon";
        this.lastUpgradeType = upgradeType;
        if (upgradeType === "weapon") this.showWeaponUpgradeChoices();
        else this.showPlayerUpgradeChoices();
    }

    showWeaponUpgradeChoices() {
        const currentWeaponIds = this.weaponManager.getWeaponIds();
        const upgradeableWeapons = this.weaponManager.getUpgradeableWeapons();
        let choices = getRandomWeaponChoices(currentWeaponIds, 2);
        
        if (choices.length < 2 && upgradeableWeapons.length > 0) {
            const randomUpgradeable = upgradeableWeapons[Math.floor(Math.random() * upgradeableWeapons.length)];
            choices.push({ 
                type: "upgrade", 
                id: randomUpgradeable.weaponId,
                name: `${randomUpgradeable.weaponName} (Lv.${randomUpgradeable.level})`,
                description: `Upgrade to Level ${randomUpgradeable.level + 1}`,
                baseStats: {
                    damage: randomUpgradeable.damage + randomUpgradeable.upgradeScaling.damage,
                    cooldown: randomUpgradeable.cooldown + randomUpgradeable.upgradeScaling.cooldown,
                    projectileSpeed: randomUpgradeable.projectileSpeed + randomUpgradeable.upgradeScaling.projectileSpeed,
                    range: randomUpgradeable.range + randomUpgradeable.upgradeScaling.range
                }
            });
        }
        
        if (choices.length === 0) {
            console.log('no weapon upgrades available');
            return;
        }
        
        this.levelUpUI.show("weapon", choices, (choice) => {
            if (choice.type === "upgrade") this.weaponManager.upgradeWeapon(choice.id);
            else this.weaponManager.addWeapon(choice);
        });
    }

    showPlayerUpgradeChoices() {
        const choices = [
            { 
                stat: "maxHealth", 
                name: "Max Health", 
                description: "Increase maximum health",
                currentValue: this.player.stats.maxHealth,
                increase: 20 
            },
            { 
                stat: "moveSpeed", 
                name: "Move Speed", 
                description: "Move faster",
                currentValue: this.player.stats.moveSpeed,
                increase: 10 
            },
            { 
                stat: "damage", 
                name: "Damage", 
                description: "Increase all weapon damage",
                currentValue: `${this.player.stats.damage * 100}%`,
                increase: "10%" 
            }
        ];
        
        this.levelUpUI.show("player", choices, (choice) => {
            if (choice.stat === "maxHealth") {
                this.player.stats.maxHealth += choice.increase;
                this.player.health = Math.min(this.player.health + choice.increase, this.player.stats.maxHealth);
            } else if (choice.stat === "moveSpeed") {
                this.player.stats.moveSpeed += choice.increase;
            } else if (choice.stat === "damage") {
                this.player.stats.damage += 0.1;
            }
            console.log(`Player upgraded ${choice.name}`);
        });
    }
}