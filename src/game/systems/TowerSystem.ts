import { GameState, TowerEntity, EnemyEntity } from '../state/GameState';
import { TOWERS } from '../data/towers';
import { ProjectileEntity } from '../state/GameState';
import { audioSystem } from './AudioSystem';

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
                if (enemy.progress > maxProgress) {
                    maxProgress = enemy.progress;
                    bestTarget = enemy;
                }
            }
        }
        return bestTarget?.id;
    }

    private fire(state: GameState, tower: TowerEntity, damage: number, targetId: string, stats: any) {
        // SFX
        audioSystem.playShoot(tower.typeId);

        // Create Projectile
        const proj: ProjectileEntity = {
            id: Math.random().toString(36),
            pos: { ...tower.pos },
            active: true,
            type: this.getProjectileType(tower.typeId),
            targetId: targetId,
            speed: tower.typeId === 'SNIPER' ? 20 : (tower.typeId === 'STICKY' ? 12 : 8),
            damage: damage,
            splashRadius: stats.splashRadius,
            slow: !!stats.slowFactor,
            slowFactor: stats.slowFactor,
            slowDuration: stats.slowDuration,
            slowStacking: tower.typeId === 'STICKY',
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
