export class HUD {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.weaponBoxes = [];
        this.weaponIcons = [];

        this.createHealthBar();
        this.createWeaponDisplay();
    }

    createHealthBar() {
        const startX = 20;
        const startY = 20;
        const barWidth = 400;
        const barHeight = 40;

        this.healthBarbg = this.scene.add.rectangle(
            startX,
            startY,
            barWidth,
            barHeight,
            0x000000,
            0.7
        ).setOrigin(0, 0).setScrollFactor(0).setDepth(999);

        this.healthBarFill = this.scene.add.rectangle(
            startX,
            startY,
            barWidth,
            barHeight,
            0xff0000
        ).setOrigin(0, 0).setScrollFactor(0).setDepth(1000);

        this.healthBarBorder = this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .strokeRect(startX, startY, barWidth, barHeight)
            .setScrollFactor(0)
            .setDepth(1001);
        
        this.healthText = this.scene.add.text(
            startX + barWidth / 2,
            startY + barHeight / 2,
            '100/100',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1002);

        this.healthBarWidth = barWidth;
    }

    createWeaponDisplay() {
        const startX = 20;
        const startY = 75;
        const spacing = 16 * 3;
        const maxWeapons = 5;

        for (let i = 0; i < maxWeapons; i++) {
            const box = this.scene.add.sprite(
                startX + i * spacing,
                startY,
                'tilesheet_i',
                103
            ).setOrigin(0, 0).setScrollFactor(0).setDepth(1000).setScale(3).setAlpha(0.5);

            this.weaponBoxes.push(box);

            const icon = this.scene.add.sprite(
                startX + i * spacing + (spacing / 2),
                startY + (spacing / 2),
                'tilesheet_w',
                0
            ).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setScale(3).setVisible(false);

            this.weaponIcons.push(icon);
        }
    }

    update() {
        this.updateHealthBar();
    }

    updateHealthBar() {
        const healthPercent = Math.max(0, this.player.health / this.player.stats.maxHealth);

        this.healthBarFill.width = this.healthBarWidth * healthPercent;

        if (healthPercent > 0.5) {
            this.healthBarFill.setFillStyle(0x00ff00);
        } else if (healthPercent > 0.25) {
            this.healthBarFill.setFillStyle(0xffff00);
        } else {
            this.healthBarFill.setFillStyle(0xff0000);
        }

        this.healthText.setText(`${Math.ceil(this.player.health)}/${this.player.stats.maxHealth}`);
    }

    updateWeaponDisplay(weapons) {
        for (let i = 0; i < 5; i++) {
            if (i < weapons.length) {
                const weapon = weapons[i];
                this.weaponBoxes[i].setAlpha(1);
                this.weaponIcons[i].setVisible(true);
                this.weaponIcons[i].setTexture(weapon.weaponData.texture);
                this.weaponIcons[i].setFrame(weapon.weaponData.frame);
            } else {
                this.weaponBoxes[i].setAlpha(0.5);
                this.weaponIcons[i].setVisible(false);
            }
        }
    }

    addWeaponLevelIndicators() {
        this.weaponLevelTexts = [];
        const startX = 20;
        const startY = 75;
        const spacing = 16 * 3;

        for (let i = 0; i < 5; i++) {
            const levelText = this.scene.add.text(
                startX + i * spacing + (spacing / 3),
                startY + (spacing / 2),
                '',
                {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    color: '#ffff00',
                    stroke: '#000000',
                    strokeThickness: 3,
                    fontStyle: 'bold'
                }
            ).setOrigin(0, 0).setScrollFactor(0).setDepth(1002).setVisible(false);

            this.weaponLevelTexts.push(levelText);
        }
    }

    updateWeaponLevels(weapons) {
        if (!this.weaponLevelTexts) return;

        for (let i = 0; i < 5; i++) {
            if (i < weapons.length) {
                const weapon = weapons[i];
                this.weaponLevelTexts[i].setText(`Lv${weapon.level}`);
                this.weaponLevelTexts[i].setVisible(true);
            } else {
                this.weaponLevelTexts[i].setVisible(false);
            }
        }
    }
}