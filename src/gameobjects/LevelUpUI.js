export class LevelUpUI {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
    }

    show(upgradeType, choices, onChoiceCallback) {
        if (this.isActive) return;

        this.isActive = true;

        const camera = this.scene.cameras.main;
        const width = camera.width;
        const height = camera.height;
        
        const overlay = this.scene.add.rectangle(
            0,
            0,
            width,
            height,
            0x000000,
            0.8
        ).setOrigin(0).setScrollFactor(0).setDepth(1000);

        this.uiElements = [overlay];

        const title = this.scene.add.text(
            width / 2,
            100,
            upgradeType == 'weapon' ? 'CHOOSE A WEAPON' : 'UPGRADE STATS',
            {
                fontSize: '48px',
                fontFamily: 'Arial',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

        this.uiElements.push(title);

        const cardWidth = 300;
        const cardSpacing = 50;
        const startX = (width / 2) - ((cardWidth + cardSpacing) * choices.length - cardSpacing) / 2 + cardWidth / 2;

        choices.forEach((choice, index) => {
            const x = startX + index * (cardWidth + cardSpacing);
            this.createChoiceCard(x, height / 2, choice, upgradeType, () => {
                onChoiceCallback(choice);
                this.hide();
            });
        });
    }

    createChoiceCard(x, y, choice, upgradeType, OnClickCallback) {
        const cardContainer = this.scene.add.container(x, y).setScrollFactor(0).setDepth(1002);
        this.uiElements.push(cardContainer);

        const card = this.scene.add.rectangle(0, 0, 280, 350, 0x333333, 0.95)
            .setStrokeStyle(4, 0xffff00);
        
        cardContainer.add(card);
        cardContainer.setSize(280, 350);
        cardContainer.setInteractive({ useHandCursor: true })
            .on('pointerover', () => card.setStrokeStyle(4, 0x00ff00))
            .on('pointerout', () => card.setStrokeStyle(4, 0xffff00))
            .on('pointerdown', OnClickCallback);

        if (upgradeType == 'weapon') {
            const name = this.scene.add.text(0, -140, choice.name, {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);//.setScrollFactor(0).setDepth(1002);
            cardContainer.add(name);
            const desc = this.scene.add.text(0, -100, choice.description, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#cccccc',
                wordWrap: { width: 260 }
            }).setOrigin(0.5);//.setScrollFactor(0).setDepth(1002);
            cardContainer.add(desc);
            const statsText = this.getWeaponStatsText(choice);
            const stats = this.scene.add.text(0, -30, statsText, {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'left'
            }).setOrigin(0.5);//.setScrollFactor(0).setDepth(1002);
            cardContainer.add(stats);
            //this.uiElements.push(name, desc, stats);
        } else {
            const statName = this.scene.add.text(0, -100, choice.name, {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);//.setScrollFactor(0).setDepth(1002);
            cardContainer.add(statName);
            const statDesc = this.scene.add.text(0, -50, choice.description, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#cccccc',
                wordWrap: { width: 260 }
            }).setOrigin(0.5);//.setScrollFactor(0).setDepth(1002);
            cardContainer.add(statDesc);
            const currentValue = this.scene.add.text(0, 20, `Current: ${choice.currentValue}`, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#aaaaaa'
            }).setOrigin(0.5);//.setScrollFactor(0).setDepth(1002);
            cardContainer.add(currentValue);
            const increase = this.scene.add.text(0, 60, `+${choice.increase}`, {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#00ff00',
                fontStyle: 'bold'
            }).setOrigin(0.5);//.setScrollFactor(0).setDepth(1002);
            cardContainer.add(increase);
            //this.uiElements.push(statName, statDesc, currentValue, increase);
        }
    }

    getWeaponStatsText(weaponData) {
        const stats = weaponData.baseStats;
        return `Damage: ${stats.damage}
Cooldown: ${stats.cooldown}ms
Speed: ${stats.projectileSpeed}
Range: ${stats.range}`;
    }

    hide() {
        this.isActive = false;

        if (this.uiElements) {
            this.uiElements.forEach(element => {
                if (element) element.destroy();
            });
            this.uiElements = [];
        }
    }
}