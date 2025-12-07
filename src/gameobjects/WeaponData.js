export const WEAPON_DATA = {
    'pistol': {
        id: 'pistol',
        name: 'Pistol',
        description: 'basic ranged weapon',
        texture: 'tilesheet_w',
        frame: 0,
        projectileTexture: 'tilesheet_i',
        projectileFrame: 58,
        baseStats: {
            damage: 10,
            cooldown: 1000,
            projectileSpeed: 300,
            range: 400,
            projectileSize: 1
        },
        upgradeScaling: {
            damage: 5,
            cooldown: -50,
            projectileSpeed: 20,
            range: 30,
            projectileSize: 0.1
        },
        maxLevel: 5
    },

    'rifle': {
        id: 'rifle',
        name: 'Rifle',
        description: 'medium ranged weapon',
        texture: 'tilesheet_w',
        frame: 5,
        projectileTexture: 'tilesheet_i',
        projectileFrame: 58,
        baseStats: {
            damage: 8,
            cooldown: 600,
            projectileSpeed: 400,
            range: 500,
            projectileSize: 0.8
        },
        upgradeScaling: {
            damage: 3,
            cooldown: -40,
            projectileSpeed: 30,
            range: 40,
            projectileSize: 0.08
        },
        maxLevel: 5
    },

    'shotgun': {
        id: 'shotgun',
        name: 'Shotgun',
        description: 'high damage, slow fire rate',
        texture: 'tilesheet_w',
        frame: 7,
        projectileTexture: 'tilesheet_i',
        projectileFrame: 58,
        baseStats: {
            damage: 25,
            cooldown: 1800,
            projectileSpeed: 250,
            range: 300,
            projectileSize: 1.3
        },
        upgradeScaling: {
            damage: 10,
            cooldown: -100,
            projectileSpeed: 15,
            range: 20,
            projectileSize: 0.15
        },
        maxLevel: 5
    },

    'smg': {
        id: 'smg',
        name: 'SMG',
        description: 'low damage, high fire rate',
        texture: 'tilesheet_w',
        frame: 2,
        projectileTexture: 'tilesheet_i',
        projectileFrame: 58,
        baseStats: {
            damage: 4,
            cooldown: 250,
            projectileSpeed: 400,
            range: 500,
            projectileSize: 0.8
        },
        upgradeScaling: {
            damage: 2,
            cooldown: -20,
            projectileSpeed: 30,
            range: 40,
            projectileSize: 0.08
        },
        maxLevel: 5
    },

    'sniper': {
        id: 'sniper',
        name: 'Sniper',
        description: 'Long range, high damage',
        texture: 'tilesheet_w',
        frame: 3,
        projectileTexture: 'tilesheet_i',
        projectileFrame: 58,
        baseStats: {
            damage: 50,
            cooldown: 3000,
            projectileSpeed: 600,
            range: 800,
            projectileSize: 1
        },
        upgradeScaling: {
            damage: 25,
            cooldown: -200,
            projectileSpeed: 20,
            range: 10,
            projectileSize: 0.05
        },
        maxLevel: 5
    }
};

export function getRandomAvailableWeapon(currentWeaponIds) {
    const availableWeapons = Object.keys(WEAPON_DATA).filter(
        id => !currentWeaponIds.includes(id)
    );

    if (availableWeapons.length == 0) return null;

    const randomIndex = Math.floor(Math.random() * availableWeapons.length);
    return WEAPON_DATA[availableWeapons[randomIndex]];
}

export function getRandomWeaponChoices(currentWeaponIds, count = 3) {
    const availableWeapons = Object.keys(WEAPON_DATA).filter(
        id => !currentWeaponIds.includes(id)
    );

    const shuffled = availableWeapons.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, availableWeapons.length)).map(id => WEAPON_DATA[id]);
}