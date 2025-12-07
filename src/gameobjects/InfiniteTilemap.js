export class InfinteTilemap {
    constructor(scene, tilemapKey, tilesetName, tilesetImage) {
        this.scene = scene;
        this.tilemapKey = tilemapKey;
        this.tilesetName = tilesetName;
        this.tilesetImage = tilesetImage;

        const basemap = scene.make.tilemap({ key: tilemapKey });

        this.mapWidth = basemap.widthInPixels;
        this.mapHeight = basemap.heightInPixels;

        this.mapScale = 2;

        this.layerNames = basemap.layers.map(layer => layer.name);

        basemap.destroy();

        this.mapInstances = [];

        this.createTilemapGrid();

        this.lastPlayerChunkX = 0;
        this.lastPlayerChunkY = 0;
    }

    createTilemapGrid() {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                this.createMapInstance(x, y);
            }
        }
    }

    createMapInstance(chunkX, chunkY) {
        const offsetX = chunkX * (this.mapWidth * this.mapScale);
        const offsetY = chunkY * (this.mapHeight * this.mapScale);

        const map = this.scene.make.tilemap({ key: this.tilemapKey });
        const tileset = map.addTilesetImage(this.tilesetName, this.tilesetImage);

        const layers = [];
        let count = 0;

        this.layerNames.forEach(layerName => {
            const layer = map.createLayer(layerName, tileset, offsetX, offsetY);
            layer.setDepth(count);
            layer.scale = this.mapScale;

            if (layer) {
                layers.push(layer);
                count++;
            }
        });

        this.mapInstances.push({
            chunkX: chunkX,
            chunkY: chunkY,
            map: map,
            tileset: tileset,
            layers: layers,
            offsetX: offsetX,
            offsetY: offsetY
        });
    }

    update(player) {
        const currentChunkX = Math.floor(player.x / (this.mapWidth * this.mapScale));
        const currentChunkY = Math.floor(player.y / (this.mapHeight * this.mapScale));

        if (currentChunkX != this.lastPlayerChunkX || currentChunkY != this.lastPlayerChunkY) {
            this.updateGrid(currentChunkX, currentChunkY);
            this.lastPlayerChunkX = currentChunkX;
            this.lastPlayerChunkY = currentChunkY;
        }
    }

    updateGrid(centerChunkX, centerChunkY) {
        this.mapInstances = this.mapInstances.filter(instance => {
            const distX = Math.abs(instance.chunkX - centerChunkX);
            const distY = Math.abs(instance.chunkY - centerChunkY);

            if (distX > 1 || distY > 1) {
                instance.layers.forEach(layer => layer.destroy());
                instance.map.destroy();
                return false;
            }
            return true;
        });

        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                const chunkX = centerChunkX + x;
                const chunkY = centerChunkY + y;

                const exists = this.mapInstances.some(
                    instance => instance.chunkX == chunkX && instance.chunkY == chunkY
                );

                if (!exists) this.createMapInstance(chunkX, chunkY);
            }
        }
    }

    addCollisionWithPlayer(player, layerName = null) {
        this.mapInstances.forEach(instance => {
            instance.layers.forEach(layer => {
                if (!layerName || layer.layer.name == layerName) {
                    this.scene.physics.add.collider(player, layer);
                }
            });
        });
    }
}