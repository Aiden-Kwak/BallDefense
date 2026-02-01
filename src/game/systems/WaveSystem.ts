import { GameState } from '../state/GameState';
import { WAVE_SCALING, SLOT_POOLS, EnemyPoolWeight } from '../data/waves';
import { ENEMIES } from '../data/enemies';
import { EnemyEntity } from '../state/GameState';
import { WaveSegment, EnemyType } from '../types';
import { gameManager } from '../GameManager';

export class WaveSystem {
    public update(state: GameState, dt: number) {
        if (!state.waveActive) return;

        const ws = state.waveState;
        const segments = ws.currentWaveSegments;

        // Check done
        if (ws.segmentIndex >= segments.length) {
            if (state.enemies.length === 0) {
                this.endWave(state);
            }
            return;
        }

        const segment = segments[ws.segmentIndex];

        // Handle Delay
        if (ws.delaying) {
            ws.timer += dt;
            const delay = segment.delay || 0;
            if (ws.timer >= delay) {
                ws.delaying = false;
                ws.timer = 0;
            }
            return;
        }

        // Spawning logic
        ws.timer += dt;
        if (ws.timer >= segment.interval) {
            ws.timer = 0;
            this.spawnEnemy(state, segment.enemyId);
            ws.spawnedCount++;

            if (ws.spawnedCount >= segment.count) {
                // Next Segment
                ws.segmentIndex++;
                ws.spawnedCount = 0;
                ws.timer = 0;

                // Prepare delay for next segment
                if (ws.segmentIndex < segments.length) {
                    const nextSeg = segments[ws.segmentIndex];
                    if (nextSeg.delay && nextSeg.delay > 0) {
                        ws.delaying = true;
                    }
                }
            }
        }
    }

    public updateIntermission(state: GameState, dt: number) {
        if (state.waveActive || state.wave <= 1) return;

        if (state.waveState.intermissionTimer > 0) {
            state.waveState.intermissionTimer -= dt;
            if (state.waveState.intermissionTimer <= 0) {
                this.startNextWave(state);
            }
        }
    }

    public startNextWave(state: GameState) {
        if (state.waveActive) return;

        // Generate segments if not present
        state.waveState.currentWaveSegments = this.generateWaveSegments(state);

        state.waveActive = true;

        // Reset Wave State
        state.waveState.segmentIndex = 0;
        state.waveState.spawnedCount = 0;
        state.waveState.timer = 0;
        state.waveState.intermissionTimer = 0;

        const firstSegment = state.waveState.currentWaveSegments[0];
        if (firstSegment && firstSegment.delay) {
            state.waveState.delaying = true;
        } else {
            state.waveState.delaying = false;
        }
    }

    private endWave(state: GameState) {
        state.waveActive = false;
        state.wave++;
        gameManager.recordWave(state.wave - 1); // Record the completed wave

        // Start Intermission
        state.waveState.intermissionTimer = 0.5;
    }

    private generateWaveSegments(state: GameState): WaveSegment[] {
        const w = state.wave;
        const season = Math.ceil(w / 10);
        const slot = (w - 1) % 10 + 1;

        let budget = WAVE_SCALING.getBudget(w);

        // Adaptive difficulty
        if (state.lives >= 18) budget *= 1.08;
        else if (state.lives <= 8) budget *= 0.92;

        const pool = SLOT_POOLS[slot] || SLOT_POOLS[7]; // Fallback to Mixed
        const segments: WaveSegment[] = [];

        // Simple generation: Pick random enemies from pool until budget is gone
        // We'll group them into segments for better pacing
        const enemyCounts: Record<string, number> = {};

        let remainingBudget = budget;
        let attempts = 0;

        while (remainingBudget > 5 && attempts < 100) {
            attempts++;
            const type = this.getRandomEnemyType(pool);
            const data = ENEMIES[type];
            if (data.threatCost <= remainingBudget) {
                enemyCounts[type] = (enemyCounts[type] || 0) + 1;
                remainingBudget -= data.threatCost;
            }
        }

        // Convert counts to segments
        Object.entries(enemyCounts).forEach(([type, count]) => {
            // Adjust interval based on count and type
            let interval = 1.0;
            if (type === 'RUNNER' || type === 'DASHLING') interval = 0.6;
            else if (type === 'BRUTE' || type === 'COREBREAKER') interval = 2.5;
            else interval = 1.2;

            segments.push({
                enemyId: type as EnemyType,
                count: count,
                interval: interval,
                delay: segments.length === 0 ? 0 : 2.0 // Spacing between segments
            });
        });

        // If no enemies spawned (budget too low?), spawn a grunt
        if (segments.length === 0) {
            segments.push({ enemyId: 'GRUNT', count: 1, interval: 1, delay: 0 });
        }

        return segments;
    }

    private getRandomEnemyType(pool: EnemyPoolWeight[]): EnemyType {
        const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
        let r = Math.random() * totalWeight;
        for (const entry of pool) {
            if (r <= entry.weight) return entry.enemyId;
            r -= entry.weight;
        }
        return pool[0].enemyId;
    }

    private spawnEnemy(state: GameState, enemyId: string) {
        const data = ENEMIES[enemyId];
        if (!data) return;

        const w = state.wave;
        const season = Math.ceil(w / 10);
        const hpMult = WAVE_SCALING.getHpMultiplier(w);
        const speedMult = WAVE_SCALING.getSpeedMultiplier(w);
        const resistBonus = WAVE_SCALING.getResistBonus(season);

        // Apply specialized resistance bonus
        let armor = data.baseStats.armor;
        let mr = data.baseStats.mr;

        if (data.id === 'BRUTE' || data.id === 'COREBREAKER' || data.id === 'GRUNT') {
            armor += resistBonus;
        } else if (data.id === 'WARDED' || data.id === 'SHIELDED') {
            mr += resistBonus;
        } else {
            // General bonus
            armor += resistBonus * 0.5;
            mr += resistBonus * 0.5;
        }

        const enemy: EnemyEntity = {
            id: Math.random().toString(36).substring(2, 9),
            typeId: enemyId,
            pos: { ...state.map.start },
            active: true,

            hp: data.baseStats.hp * hpMult,
            maxHp: data.baseStats.hp * hpMult,
            speed: data.baseStats.speed * speedMult,

            progress: 0,
            pathIndex: 0,

            slowFactor: 1,
            slowTimer: 0,
            poisonStacks: 0,
            poisonTimer: 0,
            freezeTimer: 0,

            ccResistStacks: 0,
            ccResistTimer: 0,

            shield: data.baseStats.shield ? data.baseStats.shield * hpMult : undefined,
            maxShield: data.baseStats.shield ? data.baseStats.shield * hpMult : undefined,
            reward: data.baseStats.reward,
        };

        // Apply hard caps (Speed scaling is now intended to be higher, so we might want to increase this cap or remove it)
        // User requested 1.1x every 5 waves, which could quickly exceed 1.25x.
        // I will increase the cap to 5x base to allow the requested scaling.
        enemy.speed = Math.min(enemy.speed, data.baseStats.speed * 5.0);

        state.enemies.push(enemy);
    }
}
