import { EnemyData } from '../types';

export const ENEMIES: Record<string, EnemyData> = {
    GRUNT: {
        id: 'GRUNT',
        name: 'Grunt',
        description: 'Basic infantry.',
        baseStats: { hp: 70, speed: 1.2, armor: 0, mr: 0, reward: 6 },
    },
    RUNNER: {
        id: 'RUNNER',
        name: 'Runner',
        description: 'Fast but fragile.',
        baseStats: { hp: 45, speed: 2.0, armor: 0, mr: 0, reward: 5 },
    },
    BRUTE: {
        id: 'BRUTE',
        name: 'Brute',
        description: 'Heavily armored tank.',
        baseStats: { hp: 180, speed: 0.9, armor: 20, mr: 0, reward: 10 },
    },
    WARDED: {
        id: 'WARDED',
        name: 'Warded',
        description: 'Resistant to magic.',
        baseStats: { hp: 132, speed: 1.1, armor: 0, mr: 30, reward: 9 },
    },
    SWARM: {
        id: 'SWARM',
        name: 'Swarm',
        description: 'Splits into minis on death.',
        baseStats: { hp: 90, speed: 1.0, armor: 0, mr: 0, reward: 8 },
    },
    MINI: {
        id: 'MINI',
        name: 'Mini Swarm',
        description: 'Spawned from Swarm.',
        baseStats: { hp: 25, speed: 1.6, armor: 0, mr: 0, reward: 2 },
    },
    SHIELDED: {
        id: 'SHIELDED',
        name: 'Shielded',
        description: 'Protected by a rechargeable shield.',
        baseStats: { hp: 140, speed: 1.0, armor: 15, mr: 15, reward: 11, shield: 60 },
    },
};
