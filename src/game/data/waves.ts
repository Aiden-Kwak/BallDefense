import { EnemyType } from '../types';

export const WAVE_SCALING = {
    // HP_MULT = 1 + 0.12 * w + 0.015 * (w ^ 1.25)
    getHpMultiplier: (w: number) => 1 + 0.12 * w + 0.015 * Math.pow(w, 1.25),

    // RESIST_BONUS = min(season * 2, 20)
    getResistBonus: (season: number) => Math.min(season * 2, 20),

    // SPEED_MULT = (1 + 0.015 * (season - 1)) * (1.1 ^ floor(w / 5))
    getSpeedMultiplier: (w: number) => {
        const season = Math.ceil(w / 10);
        const seasonalBase = Math.min(1 + 0.015 * (season - 1), 1.2);
        const waveStep = Math.pow(1.1, Math.floor(w / 5));
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
    8: [{ enemyId: 'COREBREAKER', weight: 40 }, { enemyId: 'BRUTE', weight: 30 }, { enemyId: 'WARDED', weight: 30 }], // Elite
    9: [{ enemyId: 'BRUTE', weight: 40 }, { enemyId: 'SHIELDED', weight: 40 }, { enemyId: 'COREBREAKER', weight: 20 }], // Mini-boss
    10: [{ enemyId: 'COREBREAKER', weight: 40 }, { enemyId: 'BRUTE', weight: 20 }, { enemyId: 'SHIELDED', weight: 20 }, { enemyId: 'WARDED', weight: 20 }], // Special/Boss
};
