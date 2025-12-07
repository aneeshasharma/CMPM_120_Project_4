import { Enemy } from "./Enemy.js";

export class EnemyManager {
    constructor(scene, enemies_g) {
        this.scene = scene;
        this.maxEnemies = 10;
        this.enemies_g = enemies_g;
    }

    spawnEnemy(enemyData, difficulty = 0) {
        if (this.enemies_g.getChildren().length >= this.maxEnemies) {
            return;
        }

        const stats = { ...enemyData.baseStats };
        const scaling = { ...enemyData.scaling};

        const circle = new Phaser.Geom.Circle(this.scene.player.x, this.scene.player.y, 1000);
        let point = circle.getPoint(Math.random());

        for (let i = 0; i < enemyData.count; i++) {
            let enemy = new Enemy(this.scene, point.x, point.y, {
                ...enemyData,
                maxHealth: stats.maxHealth + (difficulty * scaling.maxHealth),
                moveSpeed: (stats.moveSpeed + (difficulty * scaling.moveSpeed)) * this.getRandomValue(0.9, 1.1),
                damage: stats.damage + (difficulty * scaling.damage)
            });

            enemy.enemyId = enemyData.id;
            enemy.setDepth(50);

            if (enemyData.id == 'basic') {
                enemy.body.setCircle(enemyData.size, 3, 10);
            } else if (enemyData.id == 'fast') {
                enemy.body.setCircle(enemyData.size, 2, 3);
            } else if (enemyData.id == 'swarm') {
                enemy.body.setCircle(enemyData.size, 3, 7);
            } else if (enemyData.id == 'brute') {
                enemy.body.setCircle(enemyData.size, 0, 1);
            } else {
                enemy.body.setCircle(enemyData.size);
            }

            this.enemies_g.add(enemy);
        }
    }

    getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
    }
}