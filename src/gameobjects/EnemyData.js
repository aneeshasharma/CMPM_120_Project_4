export const ENEMY_DATA = {
    'basic': {
        id: 'basic',
        texture: 'tilesheet_e',
        frame: 0,
        size: 9,
        exp: 2,
        baseStats: {
            maxHealth: 25,
            moveSpeed: 70,
            damage: 1
        },
        scaling: {
            maxHealth: 5,
            moveSpeed: 1,
            damage: 0.1
        },
        count: 3
    },

    'fast': {
        id: 'fast',
        texture: 'tilesheet_e',
        frame: 4,
        size: 9,
        exp: 1,
        baseStats: {
            maxHealth: 15,
            moveSpeed: 150,
            damage: 1
        },
        scaling: {
            maxHealth: 5,
            moveSpeed: 3,
            damage: 0.2
        },
        count: 2
    },

    'swarm': {
        id: 'swarm',
        texture: 'tilesheet_e',
        frame: 8,
        size: 9,
        exp: 1,
        baseStats: {
            maxHealth: 20,
            moveSpeed: 90,
            damage: 2
        },
        scaling: {
            maxHealth: 10,
            moveSpeed: 5,
            damage: 0.2
        },
        count: 10
    },

    'brute': {
        id: 'brute',
        texture: 'tilesheet_e',
        frame: 12,
        size: 12,
        exp: 4,
        baseStats: {
            maxHealth: 60,
            moveSpeed: 100,
            damage: 5
        },
        scaling: {
            maxHealth: 20,
            moveSpeed: 3,
            damage: 1
        },
        count: 1
    }
};

