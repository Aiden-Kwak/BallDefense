import { GameState } from '../state/GameState';
import { t } from '../data/translations';
import { TOWERS } from '../data/towers';

import { TILE_SIZE } from '../constants';

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
        const { map } = state;

        // Clear
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.save();

        // Responsive Layout Calculation
        const cssThreshold = 1024;
        const isDesktop = window.innerWidth >= cssThreshold;

        const SIDEBAR_WIDTH = isDesktop ? 240 : 0;
        const BOTTOM_HEIGHT = isDesktop ? 0 : 120; // Should match HUD.tsx bottom panel

        const playableW = width - (SIDEBAR_WIDTH * (window.devicePixelRatio || 1));
        const playableH = height - (BOTTOM_HEIGHT * (window.devicePixelRatio || 1));

        const boardW = map.width * TILE_SIZE;
        const boardH = map.height * TILE_SIZE;

        // Auto-scale to fit playable area
        const scale = Math.min(playableW / boardW, playableH / boardH, 1);

        // Centering
        const paddingX = (SIDEBAR_WIDTH * (window.devicePixelRatio || 1)) + (playableW - boardW * scale) / 2;
        const paddingY = (playableH - boardH * scale) / 2;

        ctx.translate(paddingX, paddingY);
        ctx.scale(scale, scale);

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
            // ctx.shadowColor = '#22d3ee'; // Performance cost high?
            // ctx.shadowBlur = 15;
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            // ctx.shadowBlur = 0;

            // Preview Range
            if (state.uiState.previewTowerId && !state.selection.towerId) {
                const cx = x * TILE_SIZE + TILE_SIZE / 2;
                const cy = y * TILE_SIZE + TILE_SIZE / 2;
                const data = TOWERS[state.uiState.previewTowerId];
                if (data) {
                    const range = data.tiers[0].stats.range * TILE_SIZE;

                    ctx.beginPath();
                    ctx.arc(cx, cy, range, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
        }

        // Draw Range for Hovered Tower (Existing)
        if (state.uiState.hoveredTowerId && !state.selection?.towerId) {
            const tower = state.towers.find(t => t.id === state.uiState.hoveredTowerId);
            if (tower) {
                const cx = tower.pos.x * TILE_SIZE + TILE_SIZE / 2;
                const cy = tower.pos.y * TILE_SIZE + TILE_SIZE / 2;
                const data = TOWERS[tower.typeId];
                if (data) {
                    const currentTier = data.tiers[tower.tier - 1]; // Use actual tier
                    const range = currentTier.stats.range * TILE_SIZE;

                    ctx.beginPath();
                    ctx.arc(cx, cy, range, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
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
                const cellValue = map.grid[y][x];
                const isPath = cellValue === 1;
                const isBlocked = cellValue === 2;

                // Color scheme: buildable (dark blue), path (darker blue), blocked (red/orange)
                if (isBlocked) {
                    ctx.fillStyle = '#3f1f1f'; // Dark red background
                } else if (isPath) {
                    ctx.fillStyle = '#0f172a'; // Path color
                } else {
                    ctx.fillStyle = '#1e293b'; // Buildable color
                }

                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                // Border
                ctx.strokeStyle = isBlocked ? '#7f1d1d' : '#334155';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                // Visual indicators
                if (isPath) {
                    ctx.fillStyle = '#334155';
                    ctx.beginPath();
                    ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (isBlocked) {
                    // Draw X pattern for blocked tiles
                    ctx.strokeStyle = '#dc2626';
                    ctx.lineWidth = 2;
                    const padding = TILE_SIZE * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(x * TILE_SIZE + padding, y * TILE_SIZE + padding);
                    ctx.lineTo(x * TILE_SIZE + TILE_SIZE - padding, y * TILE_SIZE + TILE_SIZE - padding);
                    ctx.moveTo(x * TILE_SIZE + TILE_SIZE - padding, y * TILE_SIZE + padding);
                    ctx.lineTo(x * TILE_SIZE + padding, y * TILE_SIZE + TILE_SIZE - padding);
                    ctx.stroke();
                }
            }
        }
    }

    private drawEnemies(state: GameState) {
        const { ctx } = this;
        for (const enemy of state.enemies) {
            const cx = enemy.pos.x * TILE_SIZE + TILE_SIZE / 2;
            const cy = enemy.pos.y * TILE_SIZE + TILE_SIZE / 2;
            const size = this.getEnemySize(enemy.typeId);
            const color = this.getEnemyColor(enemy.typeId);

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + size * 0.8, size * 0.9, size * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Special Effects (Background layer)
            this.drawEnemyAuras(ctx, cx, cy, enemy);

            // Body
            ctx.save();
            ctx.translate(cx, cy);

            // Rotation for some types
            if (enemy.typeId === 'RUNNER' || enemy.typeId === 'DASHLING') {
                // Approximate rotation based on movement direction could be added here
                // For now, let's keep them oriented consistently
            }

            ctx.shadowColor = color;
            ctx.shadowBlur = enemy.typeId === 'COREBREAKER' ? 15 : 8;
            ctx.fillStyle = color;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;

            this.drawEnemyShape(ctx, enemy.typeId, size);

            ctx.fill();
            if (enemy.typeId === 'BRUTE' || enemy.typeId === 'COREBREAKER') {
                ctx.stroke();
            }
            ctx.restore();

            // Overlay Effects (Shields, etc.)
            this.drawEnemyOverlays(ctx, cx, cy, enemy, size);

            // HP Bar
            const hpPct = enemy.hp / enemy.maxHp;
            const barW = size * 2.2;
            const barY = cy - size - 8;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.fillRect(cx - barW / 2, barY, barW, 4);
            ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : '#ef4444';
            ctx.fillRect(cx - barW / 2, barY, barW * hpPct, 4);
        }
    }

    private drawEnemyShape(ctx: CanvasRenderingContext2D, typeId: string, size: number) {
        ctx.beginPath();
        switch (typeId) {
            case 'RUNNER': // Forward-facing Triangle
                ctx.moveTo(size * 1.2, 0);
                ctx.lineTo(-size * 0.8, -size * 0.8);
                ctx.lineTo(-size * 0.8, size * 0.8);
                ctx.closePath();
                break;
            case 'BRUTE': // Heavy Square
                ctx.rect(-size, -size, size * 2, size * 2);
                break;
            case 'WARDED': // Octagon
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI) / 4;
                    const x = size * Math.cos(angle);
                    const y = size * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                break;
            case 'SWARM': // Pentagon
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const x = size * Math.cos(angle);
                    const y = size * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                break;
            case 'COREBREAKER': // Large Hexagon with core
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = size * Math.cos(angle);
                    const y = size * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                break;
            case 'NEST': // Huge Hexagon with internal pods
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = size * Math.cos(angle);
                    const y = size * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                // Draw internal "pods"
                for (let i = 0; i < 3; i++) {
                    const angle = (i * 2 * Math.PI) / 3;
                    const px = (size * 0.4) * Math.cos(angle);
                    const py = (size * 0.4) * Math.sin(angle);
                    ctx.moveTo(px + 4, py);
                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                }
                break;
            case 'TANKER': // Heavy Diamond
                ctx.moveTo(size * 1.2, 0);
                ctx.lineTo(0, -size * 1.2);
                ctx.lineTo(-size * 1.2, 0);
                ctx.lineTo(0, size * 1.2);
                ctx.closePath();
                break;
            case 'DASHLING': // Narrow Diamond
                ctx.moveTo(size * 1.4, 0);
                ctx.lineTo(0, -size * 0.6);
                ctx.lineTo(-size * 0.8, 0);
                ctx.lineTo(0, size * 0.6);
                ctx.closePath();
                break;
            default: // Circle for GRUNT and MINI
                ctx.arc(0, 0, size, 0, Math.PI * 2);
        }
    }

    private drawEnemyAuras(ctx: CanvasRenderingContext2D, cx: number, cy: number, enemy: any) {
        if (enemy.typeId === 'WARDED') {
            const time = Date.now() / 1000;
            const pulse = 0.8 + Math.sin(time * 5) * 0.2;
            ctx.fillStyle = `rgba(168, 85, 247, ${0.2 * pulse})`;
            ctx.beginPath();
            ctx.arc(cx, cy, 25 * pulse, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    private drawEnemyOverlays(ctx: CanvasRenderingContext2D, cx: number, cy: number, enemy: any, size: number) {
        // Shield Ring
        if (enemy.shield && enemy.shield > 0) {
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 3;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(cx, cy, size + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Slow Effect
        if (enemy.slowFactor < 1) {
            ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.beginPath();
            ctx.arc(cx, cy, size + 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    private getEnemySize(typeId: string): number {
        switch (typeId) {
            case 'GRUNT': return 12;
            case 'RUNNER': return 11;
            case 'BRUTE': return 17;
            case 'WARDED': return 14;
            case 'SWARM': return 13;
            case 'MINI': return 7;
            case 'SHIELDED': return 14;
            case 'COREBREAKER': return 20;
            case 'DASHLING': return 9;
            case 'NEST': return 26;
            case 'TANKER': return 18;
            default: return 12;
        }
    }

    private getEnemyColor(typeId: string): string {
        switch (typeId) {
            case 'GRUNT': return '#94a3b8'; // Slate
            case 'RUNNER': return '#fbbf24'; // Amber
            case 'BRUTE': return '#10b981'; // Emerald
            case 'WARDED': return '#a855f7'; // Purple
            case 'SWARM': return '#f97316'; // Orange
            case 'MINI': return '#fdba74'; // Light Orange
            case 'SHIELDED': return '#ec4899'; // Pink
            case 'COREBREAKER': return '#ef4444'; // Red
            case 'DASHLING': return '#22d3ee'; // Cyan
            case 'NEST': return '#8b5cf6'; // Violet
            case 'TANKER': return '#4ade80'; // Bright Green
            default: return '#ffffff';
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
            ctx.fillStyle = '#334155';
            ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);

            // Unique Tower Shapes
            ctx.fillStyle = this.getTowerColor(tower.typeId);
            ctx.shadowColor = this.getTowerColor(tower.typeId);
            ctx.shadowBlur = 10;

            this.drawTowerShape(ctx, cx, cy, tower.typeId);

            ctx.shadowBlur = 0;

            // Tier Indicators
            ctx.fillStyle = '#fff';
            for (let i = 0; i < tower.tier; i++) {
                ctx.beginPath();
                ctx.arc(cx - 8 + (i * 8), cy - 12, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    private drawTowerShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, typeId: string) {
        ctx.beginPath();
        switch (typeId) {
            case 'ARROW': // Triangle
                ctx.moveTo(cx, cy - 15);
                ctx.lineTo(cx + 12, cy + 10);
                ctx.lineTo(cx - 12, cy + 10);
                ctx.closePath();
                break;
            case 'CANNON': // Square
                ctx.rect(cx - 12, cy - 12, 24, 24);
                break;
            case 'FROST': // Hexagon
                for (let i = 0; i < 6; i++) {
                    const angle = i * Math.PI / 3;
                    const px = cx + 14 * Math.cos(angle);
                    const py = cy + 14 * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.closePath();
                break;
            case 'POISON': // Drop / Diamond
                ctx.moveTo(cx, cy - 16);
                ctx.lineTo(cx + 12, cy);
                ctx.lineTo(cx, cy + 16);
                ctx.lineTo(cx - 12, cy);
                ctx.closePath();
                break;
            case 'ARCANE': // Star
                // Simple Star
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const px = cx + 15 * Math.cos(angle);
                    const py = cy + 15 * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.closePath();
                break;
            case 'TESLA': // Lightning / Jagged
                ctx.moveTo(cx - 5, cy - 15);
                ctx.lineTo(cx + 5, cy - 5);
                ctx.lineTo(cx - 2, cy - 5);
                ctx.lineTo(cx + 8, cy + 15);
                ctx.lineTo(cx - 3, cy + 3);
                ctx.lineTo(cx + 5, cy + 3);
                ctx.closePath();
                break;
            default:
                ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        }
        ctx.fill();
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
            ctx.fillStyle = '#fff'; // White core

            // Trace/Tail effect handled nicely by shadow or just simple circle
            ctx.beginPath();
            if (proj.type === 'CANNON') {
                ctx.fillStyle = '#000';
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.arc(cx, cy, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } else if (proj.type === 'MAGIC') {
                ctx.fillStyle = '#d8b4fe';
                ctx.arc(cx, cy, 4, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = '#fff';
                ctx.arc(cx, cy, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        }
    }

    private drawEffects(state: GameState) {
        const { ctx } = this;
        for (const ef of state.effects) {
            if (ef.type === 'EXPLOSION') {
                const cx = ef.pos.x * TILE_SIZE + TILE_SIZE / 2;
                const cy = ef.pos.y * TILE_SIZE + TILE_SIZE / 2;
                ctx.fillStyle = `rgba(239, 68, 68, ${ef.timer * 3})`;
                ctx.beginPath();
                ctx.arc(cx, cy, 40 * (1 - ef.timer), 0, Math.PI * 2);
                ctx.fill();
            }

            if (ef.type === 'HIT' || ef.type === 'HARM') {
                const cx = ef.pos.x * TILE_SIZE + TILE_SIZE / 2;
                const cy = ef.pos.y * TILE_SIZE + TILE_SIZE / 2;
                ctx.strokeStyle = `rgba(255, 255, 255, ${ef.timer * 4})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(cx, cy, 20 * (1 - ef.timer), 0, Math.PI * 2); // Ripple
                ctx.stroke();
            }
        }
    }
}
