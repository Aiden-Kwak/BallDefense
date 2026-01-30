import { GameState } from '../state/GameState';
import { WaveSystem } from '../systems/WaveSystem';
import { EnemySystem } from '../systems/EnemySystem';
import { TowerSystem } from '../systems/TowerSystem';
import { ProjectileSystem } from '../systems/ProjectileSystem';

export class GameLoop {
    private state: GameState;
    private lastTime: number = 0;
    private accumulator: number = 0;
    private readonly TIMESTEP = 1000 / 60;
    private isRunning: boolean = false;
    private callback: () => void;

    // Systems
    private waveSystem = new WaveSystem();
    private enemySystem = new EnemySystem();
    private towerSystem = new TowerSystem();
    private projectileSystem = new ProjectileSystem();

    constructor(state: GameState, onRender: () => void) {
        this.state = state;
        this.callback = onRender;
    }

    public start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.step);
    }

    public stop() {
        this.isRunning = false;
    }

    private step = (time: number) => {
        if (!this.isRunning) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        // Cap max delta time to prevent spiral of death
        const safeDelta = Math.min(deltaTime, 100);

        this.accumulator += safeDelta;

        while (this.accumulator >= this.TIMESTEP) {
            this.update(this.TIMESTEP / 1000);
            this.accumulator -= this.TIMESTEP;
        }

        this.callback();
        requestAnimationFrame(this.step);
    };

    private update(dt: number) {
        if (this.state.lives <= 0) return;

        this.waveSystem.update(this.state, dt);
        this.enemySystem.update(this.state, dt);
        this.towerSystem.update(this.state, dt);
        this.projectileSystem.update(this.state, dt);

        // Cleanup effects
        this.updateEffects(dt);
    }

    private updateEffects(dt: number) {
        for (let i = this.state.effects.length - 1; i >= 0; i--) {
            this.state.effects[i].timer -= dt;
            if (this.state.effects[i].timer <= 0) {
                this.state.effects.splice(i, 1);
            }
        }
    }

    // Public API for UI interactions
    public startNextWave() {
        this.waveSystem.startNextWave(this.state);
    }
}
