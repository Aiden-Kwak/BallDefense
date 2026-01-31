export type Vector2D = { x: number; y: number };

// --- Enemy Types ---
export type EnemyType = 'GRUNT' | 'RUNNER' | 'BRUTE' | 'WARDED' | 'SWARM' | 'MINI' | 'SHIELDED' | 'COREBREAKER' | 'DASHLING';

export interface EnemyStats {
  hp: number;
  speed: number; // tiles per second
  armor: number; // physical reduction % (0-100)
  mr: number;    // magic reduction % (0-100)
  reward: number;
  shield?: number; // Optional shield HP
}

export interface EnemyData {
  id: EnemyType;
  name: string;
  baseStats: EnemyStats;
  description: string;
  threatCost: number;
  onDeathSplitsInto?: { enemyId: EnemyType, count: number };
}

// --- Tower Types ---
export type TowerType = 'ARROW' | 'CANNON' | 'FROST' | 'ARCANE' | 'POISON' | 'TESLA' | 'SNIPER' | 'STICKY';
export type DamageType = 'PHYSICAL' | 'MAGIC';

export interface TowerStats {
  damage: number;
  range: number;
  fireRate: number; // attacks per second
  cost: number;
  type: DamageType;
  // Special stats
  critChance?: number; // 0-1
  splashRadius?: number; // tiles
  splashDamageMod?: number; // 0-1 (e.g. 0.5 for 50%)
  slowFactor?: number; // 0-1 (e.g. 0.2 for 20%)
  slowDuration?: number; // seconds
  freezeChance?: number; // 0-1
  freezeDuration?: number; // seconds
  poisonDps?: number;
  poisonDuration?: number;
  chainCount?: number;
  chainReduction?: number; // reduction per jump (e.g. 0.7 for 70% of previous)
  markBonus?: number; // damage multiplier
  armorShred?: number; // flat armor reduction
}

export interface TowerTier {
  tier: 1 | 2 | 3;
  stats: TowerStats;
  description?: string;
}

export interface TowerData {
  id: TowerType;
  name: string;
  unlockWave?: number;
  tiers: [TowerTier, TowerTier, TowerTier]; // Always 3 tiers
}

// --- Map Types ---
export interface MapData {
  id: string;
  name: string;
  width: number;
  height: number;
  start: Vector2D;
  end: Vector2D;
  waypoints: Vector2D[]; // Including start and end
  grid: number[][]; // 0: Buildable, 1: Path/Obstacle
}

// --- Wave Types ---
export interface WaveSegment {
  enemyId: EnemyType;
  count: number;
  interval: number; // seconds between spawns
  delay?: number; // initial delay before this segment starts
}

export interface WaveData {
  waveNumber: number;
  segments: WaveSegment[];
  rewardBonus?: number; // Extra gold for clearing wave
}
