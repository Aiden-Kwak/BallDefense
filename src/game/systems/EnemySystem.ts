import { GameState, EnemyEntity } from '../state/GameState';
import { Vector2D, EnemyType } from '../types';
import { ENEMIES } from '../data/enemies';
import { WAVE_SCALING } from '../data/waves';
import { audioSystem } from './AudioSystem';

export class EnemySystem {
    public update(state: GameState, dt: number) {
        // Process backwards to allow removal
        for (let i = state.enemies.length - 1; i >= 0; i--) {
            const enemy = state.enemies[i];

            // Apply status effects
            this.updateStatusEffects(enemy, dt);

            // Move
            if (enemy.freezeTimer <= 0) {
                this.moveEnemy(enemy, state.map.waypoints, dt);
            }

            // Check Death/Goal
            if (enemy.hp <= 0) {
                // SFX
                audioSystem.playExplosion();

                state.gold += Math.round(enemy.reward || 5);

                // Generalized Splitting Logic
                const data = ENEMIES[enemy.typeId];
                if (data && data.onDeathSplitsInto) {
                    this.spawnSubEnemies(state, enemy, data.onDeathSplitsInto.enemyId, data.onDeathSplitsInto.count);
                }

                state.enemies.splice(i, 1);
            } else if (this.hasReachedEnd(enemy, state.map.waypoints)) {
                // SFX
                audioSystem.playLifeLost();

                state.lives -= 1;
                state.enemies.splice(i, 1);
            }
        }
    }

    private updateStatusEffects(enemy: EnemyEntity, dt: number) {
        // Poison
        if (enemy.poisonStacks > 0) {
            enemy.poisonTimer -= dt;
            if (enemy.poisonTimer <= 0) {
                enemy.poisonStacks = 0;
            }
        }

        // Freeze
        if (enemy.freezeTimer > 0) {
            enemy.freezeTimer -= dt;
        }

        // Slow
        if (enemy.slowTimer > 0) {
            enemy.slowTimer -= dt;
            if (enemy.slowTimer <= 0) {
                enemy.slowFactor = 1;
            }
        }
    }

    private moveEnemy(enemy: EnemyEntity, waypoints: Vector2D[], dt: number) {
        let speed = enemy.speed * enemy.slowFactor;
        if (enemy.speedBoostTimer && enemy.speedBoostTimer > 0) {
            speed *= 1.2;
            enemy.speedBoostTimer -= dt;
        }
        const distanceToMove = speed * dt;

        let remainingDist = distanceToMove;

        while (remainingDist > 0) {
            const targetIndex = enemy.pathIndex + 1;
            if (targetIndex >= waypoints.length) break;

            const targetPos = waypoints[targetIndex];
            const dx = targetPos.x - enemy.pos.x;
            const dy = targetPos.y - enemy.pos.y;
            const distToTarget = Math.sqrt(dx * dx + dy * dy);

            if (remainingDist >= distToTarget) {
                // Reached waypoint
                enemy.pos.x = targetPos.x;
                enemy.pos.y = targetPos.y;
                enemy.pathIndex++;
                enemy.progress += distToTarget;
                remainingDist -= distToTarget;
            } else {
                // Move towards waypoint
                const ratio = remainingDist / distToTarget;
                enemy.pos.x += dx * ratio;
                enemy.pos.y += dy * ratio;
                enemy.progress += remainingDist;
                remainingDist = 0;
            }
        }
    }

    private hasReachedEnd(enemy: EnemyEntity, waypoints: Vector2D[]): boolean {
        return enemy.pathIndex >= waypoints.length - 1;
    }

    private spawnSubEnemies(state: GameState, parent: EnemyEntity, childTypeId: EnemyType, count: number) {
        const data = ENEMIES[childTypeId];
        if (!data) return;

        const w = state.wave;
        const hpMult = WAVE_SCALING.getHpMultiplier(w);
        const season = Math.ceil(w / 10);
        const speedMult = WAVE_SCALING.getSpeedMultiplier(season);

        for (let i = 0; i < count; i++) {
            const offset = (i - (count - 1) / 2) * 0.15;

            const child: EnemyEntity = {
                id: Math.random().toString(36).substring(2, 9),
                typeId: childTypeId,
                pos: { x: parent.pos.x + offset, y: parent.pos.y + offset },
                active: true,

                hp: data.baseStats.hp * hpMult,
                maxHp: data.baseStats.hp * hpMult,
                speed: data.baseStats.speed * speedMult,

                reward: data.baseStats.reward,

                progress: parent.progress,
                pathIndex: parent.pathIndex,

                slowFactor: 1,
                slowTimer: 0,
                poisonStacks: 0,
                poisonTimer: 0,
                freezeTimer: 0,

                ccResistStacks: 0,
                ccResistTimer: 0,
                speedBoostTimer: childTypeId === 'DASHLING' ? 1.0 : 0,
            };

            state.enemies.push(child);
        }
    }
}
