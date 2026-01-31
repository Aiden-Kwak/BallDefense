import { GameState, createInitialState } from './state/GameState';
import { GameLoop } from './engine/GameLoop';
import { InputHandler } from './engine/Input';
import { Renderer } from './engine/Renderer';
import { MAPS } from './data/maps';
import { TowerEntity } from './state/GameState';
import { TOWERS } from './data/towers';

export class GameManager {
    public state: GameState;
    public loop: GameLoop;
    public renderer: Renderer | null = null;
    public input: InputHandler | null = null;

    private listeners: ((state: GameState, tick: number) => void)[] = [];
    private tickCount = 0;



    constructor() {
        this.state = createInitialState(MAPS[0]);
        this.loop = new GameLoop(this.state, this.onRender.bind(this));
    }

    public init(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("No 2D Context");

        this.renderer = new Renderer(ctx);
        this.renderer.setSize(canvas.width, canvas.height);

        this.input = new InputHandler(canvas, this.state);
        this.input.onTileSelect = this.handleTileSelect.bind(this);
        this.input.onTileHover = this.handleTileHover.bind(this);

        this.loop.start();
    }

    public cleanup() {
        this.loop.stop();
        this.input?.cleanup();
    }

    public setMap(mapId: string) {
        const map = MAPS.find(m => m.id === mapId);
        if (map) {
            Object.assign(this.state, createInitialState(map));
            // Reset Arrays explicitly to be safe
            this.state.enemies = [];
            this.state.towers = [];
            this.state.projectiles = [];
        }
    }

    public subscribe(callback: (state: GameState, tick: number) => void) {
        if (!this.listeners.includes(callback)) {
            this.listeners.push(callback);
        }
    }

    public unsubscribe(callback: (state: GameState, tick: number) => void) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    private onRender() {
        this.renderer?.render(this.state);
        this.tickCount++;
        // Notify all listeners
        this.listeners.forEach(listener => listener(this.state, this.tickCount));
    }

    private handleTileSelect(x: number, y: number) {
        if (x < 0 || x >= this.state.map.width || y < 0 || y >= this.state.map.height) {
            this.state.selection = null;
            return;
        }

        const tower = this.state.towers.find(t => t.pos.x === x && t.pos.y === y);

        if (tower) {
            this.state.selection = { tile: { x, y }, towerId: tower.id };
        } else {
            // 0 = buildable, 1 = path, 2 = blocked
            if (this.state.map.grid[y][x] === 0) {
                this.state.selection = { tile: { x, y } };
            } else {
                this.state.selection = null;
            }
        }
        this.listeners.forEach(l => l(this.state, this.tickCount));
    }

    private handleTileHover(x: number, y: number) {
        // Find tower at this position
        const tower = this.state.towers.find(t => t.pos.x === x && t.pos.y === y);
        const newHoverId = tower ? tower.id : null;

        if (this.state.uiState.hoveredTowerId !== newHoverId) {
            this.state.uiState.hoveredTowerId = newHoverId;
            // Force render update if hover changes
            this.listeners.forEach(l => l(this.state, this.tickCount));
        }
    }

    public buildTower(towerId: string) {
        if (!this.state.selection || !this.state.selection.tile) return;
        if (this.state.selection.towerId) return;

        const { x, y } = this.state.selection.tile;
        const data = TOWERS[towerId];
        if (!data) return;

        const cost = Number(data.tiers[0].stats.cost);
        if (this.state.gold >= cost) {
            const oldGold = this.state.gold;
            this.state.gold -= cost;
            console.log('[GameManager] buildTower - Gold changed:', oldGold, '->', this.state.gold);
            const newTower: TowerEntity = {
                id: Math.random().toString(36),
                typeId: towerId,
                pos: { x, y },
                active: true,
                tier: 1,
                cooldown: 0
            };
            this.state.towers.push(newTower);
            this.state.selection.towerId = newTower.id;
            this.listeners.forEach(l => l(this.state, this.tickCount));
        }
    }

    public upgradeTower() {
        if (!this.state.selection?.towerId) return;
        const tower = this.state.towers.find(t => t.id === this.state.selection?.towerId);
        if (!tower || tower.tier >= 3) return;

        const data = TOWERS[tower.typeId];
        // Fix: Explicitly check bounds or cast to tell TS it's safe.
        // tower.tier is 1 or 2 here. 
        const nextIndex = tower.tier;
        if (nextIndex > 2) return; // Should be covered by >= 3 check above.

        // Force cast to satisfy tuple type [0,1,2]
        const nextTierData = data.tiers[nextIndex as 0 | 1 | 2];
        if (!nextTierData) return;

        const cost = nextTierData.stats.cost;
        if (this.state.gold >= cost) {
            this.state.gold -= cost;
            tower.tier++;
            this.listeners.forEach(l => l(this.state, this.tickCount));
        }
    }

    public sellTower() {
        if (!this.state.selection?.towerId) return;
        const index = this.state.towers.findIndex(t => t.id === this.state.selection?.towerId);
        if (index === -1) return;

        const tower = this.state.towers[index];
        const data = TOWERS[tower.typeId];
        let totalSpent = data.tiers[0].stats.cost;
        if (tower.tier >= 2) totalSpent += data.tiers[1].stats.cost;
        if (tower.tier >= 3) totalSpent += data.tiers[2].stats.cost;

        const cost = Math.floor(totalSpent * 0.3); // 30% of total investment as demolition cost

        this.state.gold -= cost;
        this.state.towers.splice(index, 1);
        this.state.selection = null;
        this.listeners.forEach(l => l(this.state, this.tickCount));
    }

    public togglePause() {
        this.state.paused = !this.state.paused;
        if (this.state.paused) {
            this.loop.stop();
        } else {
            this.loop.start();
        }
        this.listeners.forEach(l => l(this.state, this.tickCount));
    }

    public toggleSpeed() {
        this.state.speed = this.state.speed === 1 ? 2 : 1;
        // Note: Logic needs to read this speed from loops
    }

    public setPreview(towerId: string | null) {
        this.state.uiState.previewTowerId = towerId;
        this.listeners.forEach(l => l(this.state, this.tickCount));
    }
}

export const gameManager = new GameManager();

// Monkey-patch init to inject load? 
// No, React component calls init() which calls loadGame().
