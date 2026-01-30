import { GameState, TowerEntity, EnemyEntity } from '../state/GameState';
import { TOWERS } from '../data/towers';
import { ProjectileEntity } from '../state/GameState';

export class TowerSystem {
    public update(state: GameState, dt: number) {
        for (const tower of state.towers) {
            // Cooldown
            if (tower.cooldown > 0) {
                tower.cooldown -= dt;
            }

            // Target
            const data = TOWERS[tower.typeId];
            const tier = data.tiers[tower.tier - 1]; // 0-indexed tier data
            const stats = tier.stats;

            // Find Target if needed
            if (!tower.targetId || !this.isValidTarget(state, tower.targetId, tower.pos, stats.range)) {
                tower.targetId = this.findTarget(state, tower.pos, stats.range);
            }

            // Fire
            if (tower.targetId && tower.cooldown <= 0) {
                this.fire(state, tower, stats.damage, tower.targetId, stats);
                tower.cooldown = 1 / stats.fireRate;
            }
        }
    }

    private isValidTarget(state: GameState, targetId: string, pos: { x: number, y: number }, range: number): boolean {
        const enemy = state.enemies.find(e => e.id === targetId);
        if (!enemy || !enemy.active || enemy.hp <= 0) return false;

        const dx = enemy.pos.x - pos.x;
        const dy = enemy.pos.y - pos.y;
        return (dx * dx + dy * dy) <= range * range;
    }

    private findTarget(state: GameState, pos: { x: number, y: number }, range: number): string | undefined {
        let bestTarget: EnemyEntity | undefined;
        let maxProgress = -1;

        for (const enemy of state.enemies) {
            const dx = enemy.pos.x - pos.x;
            const dy = enemy.pos.y - pos.y;
            const distSq = dx * dx + dy * dy;

            if (distSq <= range * range) {
                // Priority: Progress
                // Note: Progress should be robust.
                if (enemy.progress > maxProgress) {
                    maxProgress = enemy.progress;
                    bestTarget = enemy;
                }
            }
        }
        return bestTarget?.id;
    }

    private fire(state: GameState, tower: TowerEntity, damage: number, targetId: string, stats: any) {
        // Create Projectile
        // Special: Tesla (Instant)
        if (tower.typeId === 'TESLA') {
            // Instant Hit Logic handled here or spawn "Instant Projectile"?
            // Let's spawn a generic projectile with very high speed or handle direct damage?
            // Direct damage is easier but ProjectileSystem handles effects.
            // Let's spawn a "HitScan" projectile (speed 100) or just apply now.
            // Applying now allows chaining logic immediately.
            // I'll defer to ProjectileSystem using speed=20.
        }

        const proj: ProjectileEntity = {
            id: Math.random().toString(36),
            pos: { ...tower.pos },
            active: true,
            type: this.getProjectileType(tower.typeId),
            targetId: targetId,
            speed: 8, // Default projectile speed
            damage: damage,
            splashRadius: stats.splashRadius,
            slow: !!stats.slowFactor,
            // Pass other stats like slowFactor, freezeChance via payload if needed
            // For MVP, we pass minimal and let ProjectileSystem re-lookup or assume standard.
            // Ideally ProjectileEntity has `effects` object.
        };

        state.projectiles.push(proj);
    }

    private getProjectileType(towerId: string): any {
        switch (towerId) {
            case 'CANNON': return 'CANNON';
            case 'POISON': return 'POISON';
            case 'FROST': return 'MAGIC'; // Visuals
            default: return 'ARROW';
        }
    }
}
