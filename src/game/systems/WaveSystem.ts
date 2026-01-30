import { GameState } from '../state/GameState';
import { WAVES, WAVE_SCALING } from '../data/waves';
import { ENEMIES } from '../data/enemies';
import { EnemyEntity } from '../state/GameState';

export class WaveSystem {
    public update(state: GameState, dt: number) {
        if (!state.waveActive) return;

        if (state.wave > WAVES.length) {
            state.waveActive = false;
            return;
        }

        const waveData = WAVES[state.wave - 1];
        if (!waveData) {
            state.waveActive = false;
            return;
        }

        const ws = state.waveState;

        // Check done
        if (ws.segmentIndex >= waveData.segments.length) {
            if (state.enemies.length === 0) {
                this.endWave(state, waveData.rewardBonus || 0);
            }
            return;
        }

        const segment = waveData.segments[ws.segmentIndex];

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
                if (ws.segmentIndex < waveData.segments.length) {
                    const nextSeg = waveData.segments[ws.segmentIndex];
                    if (nextSeg.delay && nextSeg.delay > 0) {
                        ws.delaying = true;
                    }
                }
            }
        }
    }

    public updateIntermission(state: GameState, dt: number) {
        if (state.waveActive || state.wave <= 1) return; // Wave 1 requires manual start

        if (state.waveState.intermissionTimer > 0) {
            state.waveState.intermissionTimer -= dt;
            if (state.waveState.intermissionTimer <= 0) {
                this.startNextWave(state);
            }
        }
    }

    public startNextWave(state: GameState) {
        if (state.waveActive) return;
        state.waveActive = true;

        // Reset Wave State
        state.waveState.segmentIndex = 0;
        state.waveState.spawnedCount = 0;
        state.waveState.timer = 0;
        state.waveState.intermissionTimer = 0;

        const waveData = WAVES[state.wave - 1];
        if (waveData && waveData.segments[0].delay) {
            state.waveState.delaying = true;
        } else {
            state.waveState.delaying = false;
        }
    }

    private endWave(state: GameState, bonus: number) {
        state.waveActive = false;
        state.gold += bonus;
        state.wave++;

        // Start Intermission (Quick transition)
        state.waveState.intermissionTimer = 0.5; // Enough to see "Wave Complete" visual if we had one, but effectively instant for user flow.
    }

    private spawnEnemy(state: GameState, enemyId: string) {
        const data = ENEMIES[enemyId];
        if (!data) return;

        const waveIndex = state.wave - 1;
        const hpMult = 1 + WAVE_SCALING.hpGrowth * waveIndex;

        const enemy: EnemyEntity = {
            id: Math.random().toString(36).substr(2, 9),
            typeId: enemyId,
            pos: { ...state.map.start },
            active: true,

            hp: data.baseStats.hp * hpMult,
            maxHp: data.baseStats.hp * hpMult,
            speed: data.baseStats.speed,

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
        };

        state.enemies.push(enemy);
    }
}
