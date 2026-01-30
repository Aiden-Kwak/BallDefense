import { WaveData } from '../types';

export const WAVE_SCALING = {
    hpGrowth: 0.18, // 1 + 0.18 * (wave-1)
    rewardGrowth: 0.06, // 1 + 0.06 * (wave-1)
};

export const WAVES: WaveData[] = [
    // W1: Grunt (Basic)
    {
        waveNumber: 1,
        segments: [
            { enemyId: 'GRUNT', count: 6, interval: 1.5, delay: 0 },
        ],
        rewardBonus: 50,
    },
    // W2: Runner (Speed check)
    {
        waveNumber: 2,
        segments: [
            { enemyId: 'GRUNT', count: 4, interval: 2, delay: 0 },
            { enemyId: 'RUNNER', count: 5, interval: 1.2, delay: 6 },
        ],
        rewardBonus: 60,
    },
    // W3: Brute (Armor check)
    {
        waveNumber: 3,
        segments: [
            { enemyId: 'GRUNT', count: 5, interval: 1.5 },
            { enemyId: 'BRUTE', count: 2, interval: 4, delay: 5 },
        ],
        rewardBonus: 70,
    },
    // W4: Swarm (AoE check)
    {
        waveNumber: 4,
        segments: [
            { enemyId: 'SWARM', count: 6, interval: 2 },
            { enemyId: 'RUNNER', count: 4, interval: 1.0, delay: 5 },
        ],
        rewardBonus: 80,
    },
    // W5: Shielded (Sustain check)
    {
        waveNumber: 5,
        segments: [
            { enemyId: 'SHIELDED', count: 3, interval: 3 },
            { enemyId: 'GRUNT', count: 10, interval: 0.8, delay: 2 },
        ],
        rewardBonus: 90,
    },
    // W6: Warded (Magic resist check)
    {
        waveNumber: 6,
        segments: [
            { enemyId: 'WARDED', count: 5, interval: 2 },
            { enemyId: 'BRUTE', count: 2, interval: 3, delay: 4 },
        ],
        rewardBonus: 100,
    },
    // W7: Mix (Runner + Swarm)
    {
        waveNumber: 7,
        segments: [
            { enemyId: 'RUNNER', count: 10, interval: 0.6 },
            { enemyId: 'SWARM', count: 5, interval: 2, delay: 2 },
        ],
        rewardBonus: 110,
    },
    // W8: Heavy Mix (Shielded + Warded)
    {
        waveNumber: 8,
        segments: [
            { enemyId: 'SHIELDED', count: 4, interval: 3 },
            { enemyId: 'WARDED', count: 4, interval: 3, delay: 1.5 },
        ],
        rewardBonus: 120,
    },
    // W9: Mini Bosses (Brute + Warded)
    {
        waveNumber: 9,
        segments: [
            { enemyId: 'BRUTE', count: 6, interval: 3 },
            { enemyId: 'WARDED', count: 6, interval: 3, delay: 1.5 },
        ],
        rewardBonus: 130,
    },
    // W10: Fast Swarm (Runner + Swarm + Grunt)
    {
        waveNumber: 10,
        segments: [
            { enemyId: 'SWARM', count: 8, interval: 1.5 },
            { enemyId: 'RUNNER', count: 12, interval: 0.5, delay: 4 },
        ],
        rewardBonus: 140,
    },
    // W11: Tank Parade (Shielded + Brute)
    {
        waveNumber: 11,
        segments: [
            { enemyId: 'SHIELDED', count: 8, interval: 2.5 },
            { enemyId: 'BRUTE', count: 5, interval: 4, delay: 5 },
        ],
        rewardBonus: 150,
    },
    // W12: Final Wave (Everything)
    {
        waveNumber: 12,
        segments: [
            { enemyId: 'GRUNT', count: 10, interval: 1 },
            { enemyId: 'RUNNER', count: 10, interval: 1, delay: 2 },
            { enemyId: 'SWARM', count: 5, interval: 3, delay: 5 },
            { enemyId: 'WARDED', count: 5, interval: 3, delay: 8 },
            { enemyId: 'SHIELDED', count: 5, interval: 3, delay: 10 },
            { enemyId: 'BRUTE', count: 5, interval: 5, delay: 12 },
        ],
        rewardBonus: 300,
    },
];
