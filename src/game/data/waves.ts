import { EnemyType } from '../types';

export const WAVE_SCALING = {
    // HP_MULT: Slightly more aggressive growth for late game
    getHpMultiplier: (w: number) => 1 + 0.14 * w + 0.02 * Math.pow(w, 1.3),

    // RESIST_BONUS = min(season * 2, 25)
    getResistBonus: (season: number) => Math.min(season * 2.5, 25),

    // SPEED_MULT: Increased from 1.1^step to 1.12^step
    getSpeedMultiplier: (w: number) => {
        const season = Math.ceil(w / 10);
        const seasonalBase = Math.min(1 + 0.02 * (season - 1), 1.3);
        const waveStep = Math.pow(1.12, Math.floor(w / 4)); // Faster frequency and higher mult
        return seasonalBase * waveStep;
    },

    // BUDGET = (80 + 18 * w + 8 * (w ^ 1.15)) * 1.5
    getBudget: (w: number) => (80 + 18 * w + 8 * Math.pow(w, 1.15)) * 1.5,
};

export interface EnemyPoolWeight {
    enemyId: EnemyType;
    weight: number;
}

export const SLOT_POOLS: Record<number, EnemyPoolWeight[]> = {
    1: [{ enemyId: 'GRUNT', weight: 80 }, { enemyId: 'RUNNER', weight: 20 }], // Warm-up
    2: [{ enemyId: 'RUNNER', weight: 70 }, { enemyId: 'DASHLING', weight: 30 }], // Speed check
    3: [{ enemyId: 'BRUTE', weight: 60 }, { enemyId: 'GRUNT', weight: 40 }], // Tank check
    4: [{ enemyId: 'SWARM', weight: 50 }, { enemyId: 'RUNNER', weight: 50 }], // Swarm check
    5: [{ enemyId: 'SHIELDED', weight: 70 }, { enemyId: 'WARDED', weight: 30 }], // Shield pressure
    6: [{ enemyId: 'WARDED', weight: 70 }, { enemyId: 'BRUTE', weight: 30 }], // Resistance pressure
    7: [{ enemyId: 'GRUNT', weight: 20 }, { enemyId: 'RUNNER', weight: 20 }, { enemyId: 'BRUTE', weight: 20 }, { enemyId: 'SWARM', weight: 20 }, { enemyId: 'SHIELDED', weight: 20 }], // Mixed
    8: [{ enemyId: 'COREBREAKER', weight: 30 }, { enemyId: 'BRUTE', weight: 20 }, { enemyId: 'WARDED', weight: 20 }, { enemyId: 'NEST', weight: 30 }],
    9: [{ enemyId: 'BRUTE', weight: 30 }, { enemyId: 'SHIELDED', weight: 30 }, { enemyId: 'NEST', weight: 40 }],
    10: [{ enemyId: 'NEST', weight: 50 }, { enemyId: 'COREBREAKER', weight: 20 }, { enemyId: 'SHIELDED', weight: 15 }, { enemyId: 'WARDED', weight: 15 }],
};
