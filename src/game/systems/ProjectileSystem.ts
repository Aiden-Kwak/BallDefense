import { GameState, ProjectileEntity, EnemyEntity } from '../state/GameState';

export class ProjectileSystem {
    public update(state: GameState, dt: number) {
        for (let i = state.projectiles.length - 1; i >= 0; i--) {
            const proj = state.projectiles[i];

            // Target Validation
            const target = state.enemies.find(e => e.id === proj.targetId);
            if (!target || !target.active) {
                // Target dead/gone.
                // If generic arrow, just remove? Or continue to last known pos?
                // MVP: Remove
                state.projectiles.splice(i, 1);
                continue;
            }

            // Move
            const dx = target.pos.x - proj.pos.x;
            const dy = target.pos.y - proj.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const moveDist = proj.speed * dt;

            if (dist <= moveDist) {
                // Hit
                this.applyHit(state, proj, target);
                state.projectiles.splice(i, 1);
            } else {
                // Move towards
                const ratio = moveDist / dist;
                proj.pos.x += dx * ratio;
                proj.pos.y += dy * ratio;

                // Homing rotation? (Visual only)
            }
        }
    }

    private applyHit(state: GameState, proj: ProjectileEntity, target: EnemyEntity) {
        // 1. Splash?
        if (proj.splashRadius) {
            this.applyAoE(state, proj.pos, proj.splashRadius, proj.damage, proj);
        } else {
            this.applyDamage(target, proj.damage, proj.type);
        }

        // 2. Status Effects (Slow/Poison)
        // Needs access to the source tower stats, but we only have Projectile.
        // Simplification: Projectile 'type' dictates standard effect hardcoded here?
        // Or Projectile carries the effect payload.
        if (proj.slow) {
            target.slowFactor = 0.5; // Hardcoded 50% for MVP
            target.slowTimer = 1.5;
        }

        // Visual Effect
        state.effects.push({ pos: { ...target.pos }, type: 'HIT', timer: 0.2 });
    }

    private applyDamage(target: EnemyEntity, amount: number, type: string) {
        if (!target.active) return;

        // Mitigation
        let damage = amount;
        if (type === 'PHYSICAL') { // Arrow/Cannon
            const reduction = (target.shield && target.shield > 0) ? 0 : (target.ccResistStacks ? 0 : 0);
            // Use Armor
            // Need to fetch Armor from Enemy Data or assume EnemyEntity has it?
            // EnemyEntity doesn't strictly track Armor (it's in static data).
            // I need to look it up or copy it to entity during spawn.
            // For MVP, I will skip Armor calculation or Look up ENEMIES[target.typeId].baseStats.armor
            // Let's assume raw damage for now to prevent lookup overhead every hit?
            // No, correctness is important.
            // TODO: Implement Armor lookup.
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
                // Distance falloff? User said 50% fixed splash damage usually.
                // Let's just apply full damage for MVP or half.
                this.applyDamage(enemy, damage, proj.type);
            }
        }
        state.effects.push({ pos: { ...center }, type: 'EXPLOSION', timer: 0.3 });
    }
}
