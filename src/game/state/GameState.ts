import { MapData, Vector2D } from '../types';
import { Language } from '../data/translations';

export interface Entity {
    id: string; // Unique ID
    pos: Vector2D;
    active: boolean;
}

export interface EnemyEntity extends Entity {
    typeId: string;
    hp: number;
    maxHp: number;
    speed: number;
    progress: number;
    pathIndex: number;
    slowFactor: number;
    slowTimer: number;
    poisonStacks: number;
    poisonTimer: number;
    freezeTimer: number;
    shield?: number;
    maxShield?: number;
    ccResistStacks: number;
    ccResistTimer: number;
    reward: number;
    speedBoostTimer?: number;
}

export interface TowerEntity extends Entity {
    typeId: string;
    tier: 1 | 2 | 3;
    cooldown: number;
    targetId?: string;
}

export interface ProjectileEntity extends Entity {
    type: 'ARROW' | 'CANNON' | 'MAGIC' | 'POISON';
    targetId?: string;
    targetPos?: Vector2D;
    direction?: Vector2D;
    maxRange?: number;
    distanceTraveled?: number;
    speed: number;
    damage: number;
    splashRadius?: number;
    slow?: boolean;
    slowFactor?: number;
    slowDuration?: number;
    slowStacking?: boolean;
}

export interface GameState {
    // World
    map: MapData;
    enemies: EnemyEntity[];
    towers: TowerEntity[];
    projectiles: ProjectileEntity[];

    // Economy & Progression
    gold: number;
    lives: number;
    wave: number;
    waveActive: boolean;
    waveTimer: number;

    // Wave Persistence
    waveState: {
        segmentIndex: number;
        spawnedCount: number;
        timer: number;
        delaying: boolean;
        intermissionTimer: number; // For auto-next wave
        currentWaveSegments: any[]; // Changed to any[] temporarily to avoid import loop or use correct type
    };

    // Input/Camera
    camera: {
        x: number;
        y: number;
        zoom: number;
    };

    // UI State
    selection: {
        tile?: Vector2D;
        towerId?: string;
    } | null;

    // Render Signals
    effects: {
        pos: Vector2D;
        type: 'EXPLOSION' | 'HIT' | 'HARM';
        timer: number;
    }[];

    // UI State
    uiState: {
        previewTowerId: string | null;
        hoveredTowerId: string | null;
    };

    // Global Settings (Runtime, not saved maybe? But useful to save)
    speed: number;
    paused: boolean;
    language: Language;

    // Statistics
    stats: {
        enemiesKilled: number;
    };
    bestStats: {
        wave: number;
        enemiesKilled: number;
    };
}

export const createInitialState = (map: MapData): GameState => ({
    map,
    enemies: [],
    towers: [],
    projectiles: [],
    gold: 150,
    lives: 20,
    wave: 1,
    waveActive: false,
    waveTimer: 0,
    waveState: {
        segmentIndex: 0,
        spawnedCount: 0,
        timer: 0,
        delaying: false,
        intermissionTimer: 0,
        currentWaveSegments: [],
    },
    camera: { x: 0, y: 0, zoom: 1 },
    selection: null,
    uiState: { previewTowerId: null, hoveredTowerId: null },
    effects: [],
    speed: 1,
    paused: false,
    language: 'ko',
    stats: {
        enemiesKilled: 0,
    },
    bestStats: {
        wave: 0,
        enemiesKilled: 0,
    },
});
