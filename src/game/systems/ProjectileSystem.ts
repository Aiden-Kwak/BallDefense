import { GameState, ProjectileEntity, EnemyEntity } from '../state/GameState';
import { ENEMIES } from '../data/enemies';
import { audioSystem } from './AudioSystem';

export class ProjectileSystem {
    public update(state: GameState, dt: number) {
        for (let i = state.projectiles.length - 1; i >= 0; i--) {
            const proj = state.projectiles[i];
            const moveDist = proj.speed * dt;

            if (proj.targetId) {
                // Homing / Targeted Projectile
                const target = state.enemies.find(e => e.id === proj.targetId);
                if (!target || !target.active) {
                    state.projectiles.splice(i, 1);
                    continue;
                }

                const dx = target.pos.x - proj.pos.x;
                const dy = target.pos.y - proj.pos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= moveDist) {
                    this.applyHit(state, proj, target);
                    state.projectiles.splice(i, 1);
                } else {
                    const ratio = moveDist / dist;
                    proj.pos.x += dx * ratio;
                    proj.pos.y += dy * ratio;
                }
            } else if (proj.direction) {
                // Directional / Untargeted Projectile
                proj.pos.x += proj.direction.x * moveDist;
                proj.pos.y += proj.direction.y * moveDist;

                // Lifetime / Range check
                if (proj.maxRange !== undefined) {
                    if (!proj.distanceTraveled) proj.distanceTraveled = 0;
                    proj.distanceTraveled += moveDist;
                    if (proj.distanceTraveled >= proj.maxRange) {
                        state.projectiles.splice(i, 1);
                        continue;
                    }
                }

                // Collision Detection against all enemies
                const hitEnemy = state.enemies.find(enemy => {
                    const dx = enemy.pos.x - proj.pos.x;
                    const dy = enemy.pos.y - proj.pos.y;
                    // Approximate hit radius
                    return (dx * dx + dy * dy) <= 0.15; // roughly 0.4 tiles radius sq
                });

                if (hitEnemy) {
                    this.applyHit(state, proj, hitEnemy);
                    state.projectiles.splice(i, 1);
                }
            } else {
                // Invalid projectile
                state.projectiles.splice(i, 1);
            }
        }
    }

    private applyHit(state: GameState, proj: ProjectileEntity, target: EnemyEntity) {
        // SFX logic before actual damage application/removal
        if (proj.splashRadius) {
            audioSystem.playExplosion();
        } else {
            audioSystem.playHit();
        }

        // 1. Splash?
        if (proj.splashRadius) {
            this.applyAoE(state, proj.pos, proj.splashRadius, proj.damage, proj);
        } else {
            let finalDamage = proj.damage;

            // Tier 3 SPIN_TURRET Close-range bonus check
            // We need to know which tower fired this. Currently ProjectileEntity doesn't store tower source.
            // Requirement says "If enemy distance <= 50% of current range: DamagePerBullet * 1.2"
            // For now, if maxRange exists and distTraveled is low, apply bonus.
            if (proj.maxRange && proj.distanceTraveled !== undefined) {
                if (proj.distanceTraveled <= proj.maxRange * 0.5) {
                    // Check if it's T3 (damage 7, bul 12, range 2.4)
                    if (proj.damage === 7 && proj.maxRange >= 2.3) {
                        finalDamage = proj.damage * 1.2;
                    }
                }
            }

            this.applyDamage(target, finalDamage, proj.type);
        }

        // 2. Status Effects (Slow/Poison)
        if (proj.slow) {
            const reduction = proj.slowFactor || 0.2;
            if (proj.slowStacking) {
                // Additive on reduction, capped at 60% slow (0.4 factor)
                target.slowFactor = Math.max(0.4, target.slowFactor - reduction);
            } else {
                // Take the strongest slow
                target.slowFactor = Math.min(target.slowFactor, 1 - reduction);
            }
            target.slowTimer = Math.max(target.slowTimer, proj.slowDuration || 1.2);
        }

        // Visual Effect
        state.effects.push({ pos: { ...target.pos }, type: 'HIT', timer: 0.2 });
    }

    private applyDamage(target: EnemyEntity, amount: number, type: string) {
        if (!target.active) return;

        // Protection Lookup
        const data = ENEMIES[target.typeId];
        let armor = data?.baseStats.armor || 0;
        let mr = data?.baseStats.mr || 0;

        // Mitigation
        let damage = amount;
        if (type === 'PHYSICAL') {
            damage = amount * (1 - (armor / 100));
        } else if (type === 'MAGIC') {
            damage = amount * (1 - (mr / 100));
        }

        // Shield interaction
        if (target.shield && target.shield > 0) {
            if (target.shield >= damage) {
                target.shield -= damage;
                damage = 0;
            } else {
                damage -= target.shield;
                target.shield = 0;
            }
        }

        target.hp -= damage;
    }

    private applyAoE(state: GameState, center: { x: number, y: number }, radius: number, damage: number, proj: ProjectileEntity) {
        for (const enemy of state.enemies) {
            const dx = enemy.pos.x - center.x;
            const dy = enemy.pos.y - center.y;
            if (dx * dx + dy * dy <= radius * radius) {
                this.applyDamage(enemy, damage, proj.type);
            }
        }
        state.effects.push({ pos: { ...center }, type: 'EXPLOSION', timer: 0.3 });
    }
}
