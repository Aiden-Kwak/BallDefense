import { TowerData } from '../types';

export const TOWERS: Record<string, TowerData> = {
    ARROW: {
        id: 'ARROW',
        name: 'Arrow Tower',
        unlockWave: 1,
        tiers: [
            {
                tier: 1,
                stats: { cost: 40, range: 2.8, fireRate: 1.0, damage: 16, type: 'PHYSICAL' },
                description: 'Basic physical damage.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 2.8, fireRate: 1.1, damage: 24, type: 'PHYSICAL' },
                description: 'Improved fire rate and damage.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 2.8, fireRate: 1.1, damage: 34, type: 'PHYSICAL', critChance: 0.15 },
                description: 'Chance to deal double damage.'
            },
        ],
    },
    CANNON: {
        id: 'CANNON',
        name: 'Cannon',
        unlockWave: 2,
        tiers: [
            {
                tier: 1,
                stats: { cost: 60, range: 2.6, fireRate: 0.6, damage: 28, type: 'PHYSICAL', splashRadius: 0.9, splashDamageMod: 0.5 },
                description: 'Area of effect physical damage.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 2.6, fireRate: 0.6, damage: 38, type: 'PHYSICAL', splashRadius: 0.95, splashDamageMod: 0.5 },
                description: 'Larger splash radius.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 2.6, fireRate: 0.6, damage: 52, type: 'PHYSICAL', splashRadius: 0.95, splashDamageMod: 0.6 },
                description: 'High splash damage.'
            },
        ],
    },
    FROST: {
        id: 'FROST',
        name: 'Frost Spire',
        unlockWave: 3,
        tiers: [
            {
                tier: 1,
                stats: { cost: 50, range: 2.7, fireRate: 0.9, damage: 10, type: 'MAGIC', slowFactor: 0.2, slowDuration: 1.2 },
                description: 'Slows enemies.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 2.7, fireRate: 0.9, damage: 10, type: 'MAGIC', slowFactor: 0.28, slowDuration: 1.4 },
                description: 'Stronger slow.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 2.7, fireRate: 0.9, damage: 10, type: 'MAGIC', slowFactor: 0.28, slowDuration: 1.4, freezeChance: 0.1, freezeDuration: 0.6 },
                description: 'Chance to freeze (stun) enemies.'
            },
        ],
    },
    ARCANE: {
        id: 'ARCANE',
        name: 'Arcane Crystal',
        unlockWave: 5,
        tiers: [
            {
                tier: 1,
                stats: { cost: 65, range: 2.9, fireRate: 0.7, damage: 34, type: 'MAGIC' },
                description: 'High burst magic damage.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 2.9, fireRate: 0.7, damage: 48, type: 'MAGIC' },
                description: 'Increased damage.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 2.9, fireRate: 0.7, damage: 48, type: 'MAGIC', markBonus: 1.3 },
                description: 'Marks target for bonus damage on 3rd hit.'
            },
        ],
    },
    POISON: {
        id: 'POISON',
        name: 'Poison Trap',
        unlockWave: 7,
        tiers: [
            {
                tier: 1,
                stats: { cost: 55, range: 2.6, fireRate: 0.8, damage: 8, type: 'MAGIC', poisonDps: 6, poisonDuration: 2.5 },
                description: 'Applies damage over time.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 2.6, fireRate: 0.8, damage: 8, type: 'MAGIC', poisonDps: 8, poisonDuration: 2.8 },
                description: 'Stronger poison.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 2.6, fireRate: 0.8, damage: 8, type: 'MAGIC', poisonDps: 8, poisonDuration: 2.8, armorShred: 8 },
                description: 'Corrodes armor on stacked poison.'
            },
        ],
    },
    TESLA: {
        id: 'TESLA',
        name: 'Tesla Coil',
        unlockWave: 10,
        tiers: [
            {
                tier: 1,
                stats: { cost: 75, range: 2.5, fireRate: 0.75, damage: 18, type: 'MAGIC', chainCount: 2, chainReduction: 0.7 },
                description: 'Chains damage to nearby enemies.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 2.5, fireRate: 0.75, damage: 18, type: 'MAGIC', chainCount: 3, chainReduction: 0.7 },
                description: 'Chains to 3 targets.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 2.5, fireRate: 0.75, damage: 18, type: 'MAGIC', chainCount: 4, chainReduction: 0.7 },
                description: 'Chains to 4 targets. Bonus vs Shields.'
            },
        ],
    },
    SNIPER: {
        id: 'SNIPER',
        name: 'Sniper Tower',
        unlockWave: 4,
        tiers: [
            {
                tier: 1,
                stats: { cost: 70, range: 6.0, fireRate: 0.3, damage: 55, type: 'PHYSICAL' },
                description: 'Extreme range single target damage.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 6.5, fireRate: 0.3, damage: 85, type: 'PHYSICAL' },
                description: 'Increased range and damage.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 7.0, fireRate: 0.3, damage: 125, type: 'PHYSICAL', critChance: 0.25 },
                description: 'Deadly precision with high crit chance.'
            },
        ],
    },
    STICKY: {
        id: 'STICKY',
        name: 'Sticky Tower',
        unlockWave: 6,
        tiers: [
            {
                tier: 1,
                stats: { cost: 55, range: 2.6, fireRate: 1.2, damage: 4, type: 'MAGIC', slowFactor: 0.12, slowDuration: 1.5 },
                description: 'Applies weak stackable slow.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 2.6, fireRate: 1.4, damage: 6, type: 'MAGIC', slowFactor: 0.15, slowDuration: 1.8 },
                description: 'Faster firing and stronger slow.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 2.6, fireRate: 1.6, damage: 8, type: 'MAGIC', slowFactor: 0.18, slowDuration: 2.0 },
                description: 'High stack potential with rapid fire.'
            },
        ],
    },
    SPIN_TURRET: {
        id: 'SPIN_TURRET',
        name: 'Spin Turret',
        unlockWave: 5,
        tiers: [
            {
                tier: 1,
                stats: { cost: 70, range: 2.2, fireRate: 0.83, damage: 6, type: 'PHYSICAL', bulletsPerCycle: 8 },
                description: 'Fires bullets in all directions.'
            },
            {
                tier: 2,
                stats: { cost: 30, range: 2.3, fireRate: 0.91, damage: 7, type: 'PHYSICAL', bulletsPerCycle: 10 },
                description: 'More bullets and increased range.'
            },
            {
                tier: 3,
                stats: { cost: 40, range: 2.4, fireRate: 1.0, damage: 7, type: 'PHYSICAL', bulletsPerCycle: 12 },
                description: '360° pressure. Bonus damage at close range.'
            },
        ],
    },
};

