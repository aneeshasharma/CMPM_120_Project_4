import { Player } from '../gameobjects/Player.js';
import { WeaponManager } from '../gameobjects/WeaponManager.js';
import { LevelUpUI } from '../gameobjects/LevelUpUI.js';
import { WEAPON_DATA, getRandomWeaponChoices } from '../gameobjects/WeaponData.js';
import { EnemyManager } from '../gameobjects/EnemyManager.js';
import { ENEMY_DATA } from '../gameobjects/EnemyData.js';
import { GameTimer } from '../gameobjects/GameTimer.js';
import { HUD } from '../gameobjects/HUD.js';
import { InfinteTilemap } from '../gameobjects/InfiniteTilemap.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
        this.lastUpgradeType = null;
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.image('bullet', 'assets/PNG/Interface/Tiles/tile_0058.png')
        this.load.spritesheet('tilesheet_p', 'assets/PNG/Players/Tilemap/tilemap.png', { frameWidth: 24, frameHeight: 24, spacing: 1 });
        this.load.spritesheet('tilesheet_e', 'assets/PNG/Enemies/Tilemap/tilemap.png', { frameWidth: 24, frameHeight: 24, spacing: 1 });
        this.load.spritesheet('tilesheet_i', 'assets/PNG/Interface/Tilemap/tilemap.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
        this.load.spritesheet('tilesheet_w', 'assets/PNG/Weapons/Tilemap/tilemap.png', { frameWidth: 24, frameHeight: 24, spacing: 1 });

        this.load.tilemapTiledJSON('map', 'assets/maps/map1.tmj');
        this.load.image('tiles', 'assets/PNG/Tiles/Tilemap/tilemap.png');
    }

    create() {
        this.infiniteTilemap = new InfinteTilemap(this, 'map', 'tileset', 'tiles');
        
        this.player = new Player(this, 640, 320, 'tilesheet_p', 0);
        this.player.body.setCircle(11, 1, 3);
        this.player.setDepth(50);

        this.cameras.main.startFollow(this.player, true);

        this.enemies_g = this.physics.add.group({ runChildUpdate: true });

        this.physics.add.collider(this.enemies_g, this.enemies_g);
        this.physics.add.collider(this.player, this.enemies_g, (p, e) => { e.takeDamage(e.damage, this.player.stats.damage); this.player.takeDamage(e.damage); });
        //this.infiniteTilemap.addCollisionWithPlayer(this.player, 'walls');

        this.weaponManager = new WeaponManager(this, this.player);
        this.levelUpUI = new LevelUpUI(this);
        this.enemyManager = new EnemyManager(this, this.enemies_g);
        this.hud = new HUD(this, this.player);
        this.hud.addWeaponLevelIndicators();

        this.events.on('playerLevelUp', this.onPlayerLevelUp, this);
        this.events.on('enemyDied', this.player.addXP, this.player);

        this.gameTimer = new GameTimer(this);
        this.gameTimer.start();

        this.gameTimer.setEndGameTime(1200);

        this.weaponManager.addWeapon(WEAPON_DATA.pistol);
        this.hud.updateWeaponDisplay(this.weaponManager.weapons);
        this.hud.updateWeaponLevels(this.weaponManager.weapons);

        this.enemyManager.spawnEnemy(ENEMY_DATA.basic);
        this.setupTimedSpawns();
    }

    update(time) {
        if (this.levelUpUI.isActive) {
            this.player.body.setVelocity(0, 0);
            return;
        }

        this.player.update();
        this.weaponManager.update(time);
        this.gameTimer.update();
        this.hud.update();

        if (this.infiniteTilemap) {
            this.infiniteTilemap.update(this.player);
        }
    }

    setupTimedSpawns() {
        this.gameTimer.addSpawnEvent(0, () => {
            this.enemyManager.spawnEnemy(ENEMY_DATA.basic);
        });

        this.basicId = this.gameTimer.addSpawnEvent(5, () => {
            this.enemyManager.spawnEnemy(ENEMY_DATA.basic);
        }, true);

        this.fastId = this.gameTimer.addSpawnEvent(15, () => {
            this.enemyManager.spawnEnemy(ENEMY_DATA.fast);
        }, true);

        this.swarmId = this.gameTimer.addSpawnEvent(25, () => {
            this.enemyManager.spawnEnemy(ENEMY_DATA.swarm);
        }, true);

        this.gameTimer.addSpawnEvent(35, () => {
            this.enemyManager.spawnEnemy(ENEMY_DATA.brute, 5);
        });

        this.gameTimer.addSpawnEvent(45, () => {
            this.enemyManager.spawnEnemy(ENEMY_DATA.brute, 5);
        });

        this.gameTimer.addSpawnEvent(60, () => {
            this.gameTimer.removeSpawnEvent(this.basicId);
            this.gameTimer.removeSpawnEvent(this.fastId);

            this.basicId = this.gameTimer.addSpawnEvent(5, () => {
                this.enemyManager.spawnEnemy(ENEMY_DATA.basic, 3);
            }, true);

            this.fastId = this.gameTimer.addSpawnEvent(15, () => {
                this.enemyManager.spawnEnemy(ENEMY_DATA.fast, 3);
            })
        });

        this.gameTimer.addSpawnEvent(80, () => {
            this.gameTimer.removeSpawnEvent(this.swarmId);

            this.swarmId = this.gameTimer.addSpawnEvent(20, () => {
                this.enemyManager.spawnEnemy(ENEMY_DATA.swarm, 4);
            })
            this.bruteId = this.gameTimer.addSpawnEvent(8, () => {
                this.enemyManager.spawnEnemy(ENEMY_DATA.brute, 8);
            })
        })
    }
    
    onPlayerLevelUp() {
        const upgradeType = this.lastUpgradeType == 'weapon' ? 'player' : 'weapon';
        this.lastUpgradeType = upgradeType;

        if (upgradeType == 'weapon') {
            this.showWeaponUpgradeChoices();
        } else {
            this.showPlayerUpgradeChoices();
        }
    }

    showWeaponUpgradeChoices() {
        const currentWeaponIds = this.weaponManager.getWeaponIds();
        const upgradeableWeapons = this.weaponManager.getUpgradeableWeapons();

        let choices = [];

        const newWeaponChoices = getRandomWeaponChoices(currentWeaponIds, 2);
        choices = choices.concat(newWeaponChoices);

        if (choices.length <= 2) {
            while (choices.length <= 2) {
                if (upgradeableWeapons.length > 0) {
                    const randomUpgradeable = upgradeableWeapons[Math.floor(Math.random() * upgradeableWeapons.length)];

                    choices.push({
                        type: 'upgrade',
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
            }
        }

        if (choices.length == 0) {
            console.log('no weapon upgrades available');
            return;
        }

        this.levelUpUI.show('weapon', choices, (choice) => {
            if (choice.type == 'upgrade') {
                this.weaponManager.upgradeWeapon(choice.id);
            } else {
                this.weaponManager.addWeapon(choice);
            }

            this.hud.updateWeaponDisplay(this.weaponManager.weapons);
            this.hud.updateWeaponLevels(this.weaponManager.weapons);
        });
    }

    showPlayerUpgradeChoices() {
        const choices = [
            {
                stat: 'maxHealth',
                name: 'Max Health',
                description: 'Increase maximum health',
                currentValue: this.player.stats.maxHealth,
                increase: 20
            },
            {
                stat: 'moveSpeed',
                name: 'Move Speed',
                description: 'Move faster',
                currentValue: this.player.stats.moveSpeed,
                increase: 10
            },
            {
                stat: 'damage',
                name: 'Damage',
                description: 'Increase all weapon damage',
                currentValue: `${Math.round(this.player.stats.damage * 100)}%`,
                increase: '10%'
            }
        ];

        this.levelUpUI.show('player', choices, (choice) => {
            if (choice.stat == 'maxHealth') {
                this.player.stats.maxHealth += choice.increase;
                this.player.health = Math.min(this.player.health + choice.increase, this.player.stats.maxHealth);
            } else if (choice.stat == 'moveSpeed') {
                this.player.stats.moveSpeed += choice.increase;
            } else if (choice.stat == 'damage') {
                this.player.stats.damage += +choice.increase.replace('%', '') / 100;
            }
            console.log(`Player upgraded ${choice.name}`);
        });
    }
}
