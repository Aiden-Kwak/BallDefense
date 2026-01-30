import { GameState } from '../state/GameState';

const TILE_SIZE = 64;

// Modern "Dark Cyber" Palette
const COLORS = {
    bg: '#020617', // Slate-950
    gridLine: '#1e293b', // Slate-800
    path: '#0f172a', // Slate-900 (darker path)
    buildable: '#1e293b',
    pathAccent: '#334155',
};

export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private width: number = 0;
    private height: number = 0;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public setSize(w: number, h: number) {
        this.width = w;
        this.height = h;
    }

    public render(state: GameState) {
        const { ctx, width, height } = this;
        const { map, camera } = state;

        // Clear with bg
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.save();

        // Camera Transform
        ctx.translate(camera.x + width / 2, camera.y + height / 2);
        const boardW = map.width * TILE_SIZE;
        const boardH = map.height * TILE_SIZE;
        ctx.translate(-boardW / 2, -boardH / 2);

        // Draw Map Layers
        this.drawGrid(state);

        // Entities
        this.drawTowers(state);
        this.drawEnemies(state);
        this.drawProjectiles(state);
        this.drawEffects(state);

        // Selection Highlight
        if (state.selection?.tile) {
            const { x, y } = state.selection.tile;
            ctx.strokeStyle = '#22d3ee'; // Cyan-400
            ctx.lineWidth = 3;
            ctx.shadowColor = '#22d3ee';
            ctx.shadowBlur = 15;
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }

    private drawGrid(state: GameState) {
        const { map } = state;
        const { ctx } = this;

        // Base Board
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, map.width * TILE_SIZE, map.height * TILE_SIZE);

        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const isPath = map.grid[y][x] === 1;

                // Tile BG
                ctx.fillStyle = isPath ? '#0f172a' : '#1e293b';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                // Grid Lines
                ctx.strokeStyle = '#334155';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                // Path Decor (Dots)
                if (isPath) {
                    ctx.fillStyle = '#334155';
                    ctx.beginPath();
                    ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    private drawEnemies(state: GameState) {
        const { ctx } = this;
        for (const enemy of state.enemies) {
            const cx = enemy.pos.x * TILE_SIZE + TILE_SIZE / 2;
            const cy = enemy.pos.y * TILE_SIZE + TILE_SIZE / 2;

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 12, 12, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Body (Glow)
            const color = this.getEnemyColor(enemy.typeId);
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Inner detail (Eye)
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cx, cy, 5, 0, Math.PI * 2);
            ctx.fill();

            // HP Bar (Floating)
            const hpPct = enemy.hp / enemy.maxHp;
            const barW = 30;
            const barY = cy - 24;

            // Bg
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(cx - barW / 2, barY, barW, 4);
            // Fg
            ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : '#ef4444';
            ctx.fillRect(cx - barW / 2, barY, barW * hpPct, 4);
        }
    }

    private getEnemyColor(typeId: string): string {
        switch (typeId) {
            case 'GRUNT': return '#60a5fa'; // Blue
            case 'RUNNER': return '#f87171'; // Red
            case 'BRUTE': return '#34d399'; // Green
            case 'SWARM': return '#fcd34d'; // Amber
            case 'WARDED': return '#c084fc'; // Purple
            case 'SHIELDED': return '#f472b6'; // Pink
            default: return '#fff';
        }
    }

    private drawTowers(state: GameState) {
        const { ctx } = this;
        for (const tower of state.towers) {
            const x = tower.pos.x * TILE_SIZE;
            const y = tower.pos.y * TILE_SIZE;
            const cx = x + TILE_SIZE / 2;
            const cy = y + TILE_SIZE / 2;

            // Base Platform
            ctx.fillStyle = '#475569';
            ctx.fillRect(x + 8, y + 8, TILE_SIZE - 16, TILE_SIZE - 16);

            // Turret Body
            ctx.fillStyle = this.getTowerColor(tower.typeId);
            ctx.beginPath();
            ctx.arc(cx, cy, 18, 0, Math.PI * 2);
            ctx.fill();

            // Tier Indicators (dots)
            ctx.fillStyle = '#fff';
            for (let i = 0; i < tower.tier; i++) {
                ctx.beginPath();
                ctx.arc(cx - 8 + (i * 8), cy - 6, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    private getTowerColor(typeId: string): string {
        switch (typeId) {
            case 'ARROW': return '#3b82f6';
            case 'CANNON': return '#ef4444';
            case 'FROST': return '#22d3ee';
            case 'POISON': return '#10b981';
            case 'ARCANE': return '#a855f7';
            case 'TESLA': return '#fbbf24';
            default: return '#94a3b8';
        }
    }

    private drawProjectiles(state: GameState) {
        const { ctx } = this;
        for (const proj of state.projectiles) {
            const cx = proj.pos.x * TILE_SIZE + TILE_SIZE / 2;
            const cy = proj.pos.y * TILE_SIZE + TILE_SIZE / 2;

            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 5;
            ctx.fillStyle = '#fff';

            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    private drawEffects(state: GameState) {
        const { ctx } = this;
        for (const ef of state.effects) {
            if (ef.type === 'EXPLOSION') {
                const cx = ef.pos.x * TILE_SIZE + TILE_SIZE / 2;
                const cy = ef.pos.y * TILE_SIZE + TILE_SIZE / 2;
                ctx.fillStyle = `rgba(239, 68, 68, ${ef.timer * 3})`; // Fade out
                ctx.beginPath();
                ctx.arc(cx, cy, 30 * (1 - ef.timer), 0, Math.PI * 2); // Expand
                ctx.fill();
            }

            if (ef.type === 'HIT') {
                const cx = ef.pos.x * TILE_SIZE + TILE_SIZE / 2;
                const cy = ef.pos.y * TILE_SIZE + TILE_SIZE / 2;
                ctx.fillStyle = `rgba(255, 255, 255, ${ef.timer * 5})`;
                ctx.beginPath();
                ctx.arc(cx, cy, 10 * (1 - ef.timer), 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
