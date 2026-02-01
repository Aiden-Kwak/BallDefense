import { GameState } from '../state/GameState';
import { TILE_SIZE } from '../constants';

export class InputHandler {
    private canvas: HTMLCanvasElement;
    private state: GameState;

    // Panning (Disabled by user request)
    private isDown = false;

    // Interaction callbacks
    public onTileSelect?: (x: number, y: number) => void;
    public onTileHover?: (x: number, y: number) => void;

    constructor(canvas: HTMLCanvasElement, state: GameState) {
        this.canvas = canvas;
        this.state = state;
        this.attachListeners();
    }

    private attachListeners() {
        // Mouse
        this.canvas.addEventListener('mousedown', this.onPointerDown);
        this.canvas.addEventListener('mousemove', this.onPointerMove);
        this.canvas.addEventListener('mouseup', this.onPointerUp);
        this.canvas.addEventListener('mouseleave', this.onPointerUp);

        // Touch
        this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.onTouchEnd);
    }

    public cleanup() {
        this.canvas.removeEventListener('mousedown', this.onPointerDown);
        this.canvas.removeEventListener('mousemove', this.onPointerMove);
        this.canvas.removeEventListener('mouseup', this.onPointerUp);
        this.canvas.removeEventListener('mouseleave', this.onPointerUp);

        this.canvas.removeEventListener('touchstart', this.onTouchStart);
        this.canvas.removeEventListener('touchmove', this.onTouchMove);
        this.canvas.removeEventListener('touchend', this.onTouchEnd);
    }

    // --- Pointer Handlers ---

    private onPointerDown = (e: MouseEvent) => {
        e.preventDefault();
        this.handleStart(e.clientX, e.clientY);
    };

    private onPointerMove = (e: MouseEvent) => {
        e.preventDefault();
        this.handleMove(e.clientX, e.clientY);
    };

    private onPointerUp = (e: MouseEvent) => {
        e.preventDefault();
        this.handleEnd(e.clientX, e.clientY);
    };

    private onTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 1) {
            const t = e.touches[0];
            this.handleStart(t.clientX, t.clientY);
        }
    };

    private onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 1) {
            const t = e.touches[0];
            this.handleMove(t.clientX, t.clientY);
        }
    };

    private onTouchEnd = (e: TouchEvent) => {
        const t = e.changedTouches[0];
        this.handleEnd(t.clientX, t.clientY);
    };

    // --- Logic ---

    public handleStart(x: number, y: number) {
        this.isDown = true;
    }

    public handleMove(screenX: number, screenY: number) {
        const { tileX, tileY } = this.getTileFromScreen(screenX, screenY);
        this.onTileHover?.(tileX, tileY);
    }

    public handleEnd(x: number, y: number) {
        if (this.isDown) { // Simple click detection (no drag check needed as drag is disabled)
            const { tileX, tileY } = this.getTileFromScreen(x, y);
            this.onTileSelect?.(tileX, tileY);
        }
        this.isDown = false;
    }

    private getTileFromScreen(screenX: number, screenY: number) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;
        const cssW = rect.width;
        const cssH = rect.height;
        const scaleX = canvasW / cssW;
        const scaleY = canvasH / cssH;

        const canvasX = (screenX - rect.left) * scaleX;
        const canvasY = (screenY - rect.top) * scaleY;

        const cssThreshold = 1024;
        const isDesktop = window.innerWidth >= cssThreshold;
        const dpr = window.devicePixelRatio || 1;

        const SIDEBAR_WIDTH = isDesktop ? 240 : 0;
        const BOTTOM_HEIGHT = isDesktop ? 0 : 120;

        const playableW = canvasW - (SIDEBAR_WIDTH * dpr);
        const playableH = canvasH - (BOTTOM_HEIGHT * dpr);

        const boardW = this.state.map.width * TILE_SIZE;
        const boardH = this.state.map.height * TILE_SIZE;

        // Auto-scale to fit
        const scale = Math.min(playableW / boardW, playableH / boardH, 1);

        const paddingX = (SIDEBAR_WIDTH * dpr) + (playableW - boardW * scale) / 2;
        const paddingY = (playableH - boardH * scale) / 2;

        const worldX = (canvasX - paddingX) / scale;
        const worldY = (canvasY - paddingY) / scale;

        const tileX = Math.floor(worldX / TILE_SIZE);
        const tileY = Math.floor(worldY / TILE_SIZE);

        return { tileX, tileY };
    }
}
