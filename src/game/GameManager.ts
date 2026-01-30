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

    private onStateChangeCallback: ((state: GameState, tick: number) => void) | null = null;
    private tickCount = 0;

    private SAVE_KEY = 'ball_defense_save_v1';
    private AUTO_SAVE_INTERVAL = 5000;
    private autoSaveTimer: any = null;

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

        // Attempt Load
        if (this.loadGame()) {
            console.log("Game Loaded from LocalStorage");
        }

        this.loop.start();

        // Auto Save
        if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
        this.autoSaveTimer = setInterval(() => this.saveGame(), this.AUTO_SAVE_INTERVAL);
    }

    public cleanup() {
        this.loop.stop();
        this.input?.cleanup();
        if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
    }

    public setMap(mapId: string) {
        const map = MAPS.find(m => m.id === mapId);
        if (map) {
            Object.assign(this.state, createInitialState(map));
            // Reset Arrays explicitly to be safe
            this.state.enemies = [];
            this.state.towers = [];
            this.state.projectiles = [];
            this.saveGame();
        }
    }

    public subscribe(callback: (state: GameState, tick: number) => void) {
        this.onStateChangeCallback = callback;
    }

    public unsubscribe() {
        this.onStateChangeCallback = null;
    }

    private onRender() {
        this.renderer?.render(this.state);
        this.tickCount++;
        if (this.tickCount % 6 === 0) {
            this.onStateChangeCallback?.(this.state, this.tickCount);
        }
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
            if (this.state.map.grid[y][x] === 0) {
                this.state.selection = { tile: { x, y } };
            } else {
                this.state.selection = null;
            }
        }
        this.onStateChangeCallback?.(this.state, this.tickCount);
    }

    public buildTower(towerId: string) {
        if (!this.state.selection || !this.state.selection.tile) return;
        if (this.state.selection.towerId) return;

        const { x, y } = this.state.selection.tile;
        const data = TOWERS[towerId];
        if (!data) return;

        const cost = Number(data.tiers[0].stats.cost);
        if (this.state.gold >= cost) {
            this.state.gold -= cost;
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
            this.saveGame();
            this.onStateChangeCallback?.(this.state, this.tickCount);
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
            this.saveGame();
            this.onStateChangeCallback?.(this.state, this.tickCount);
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

        const refund = Math.floor(totalSpent * 0.7);

        this.state.gold += refund;
        this.state.towers.splice(index, 1);
        this.state.selection = null;
        this.saveGame();
        this.onStateChangeCallback?.(this.state, this.tickCount);
    }

    public togglePause() {
        this.state.paused = !this.state.paused;
        if (this.state.paused) {
            this.loop.stop();
        } else {
            this.loop.start();
        }
        this.onStateChangeCallback?.(this.state, this.tickCount);
    }

    public toggleSpeed() {
        this.state.speed = this.state.speed === 1 ? 2 : 1;
        // Note: Logic needs to read this speed from loops
    }

    // --- Persistence ---

    public saveGame() {
        try {
            const json = JSON.stringify(this.state);
            localStorage.setItem(this.SAVE_KEY, json);
        } catch (e) {
            console.warn("Save failed", e);
        }
    }

    public loadGame(): boolean {
        if (typeof window === 'undefined') return false;
        const json = localStorage.getItem(this.SAVE_KEY);
        if (!json) return false;

        try {
            const loaded = JSON.parse(json);
            this.state.enemies.length = 0;
            this.state.towers.length = 0;
            this.state.projectiles.length = 0;
            this.state.effects.length = 0;

            Object.assign(this.state, loaded);
            this.state.uiState = { previewTowerId: null }; // Reset UI
            return true;
        } catch (e) {
            console.warn("Load failed", e);
            return false;
        }
    }

    public setPreview(towerId: string | null) {
        this.state.uiState.previewTowerId = towerId;
        this.onStateChangeCallback?.(this.state, this.tickCount);
    }

    public resetGame() {
        localStorage.removeItem(this.SAVE_KEY);
        window.location.reload();
    }
}

export const gameManager = new GameManager();

// Monkey-patch init to inject load? 
// No, React component calls init() which calls loadGame().
