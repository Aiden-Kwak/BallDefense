import { GameState } from '../state/GameState';
import { TILE_SIZE } from '../constants';

export class InputHandler {
    private canvas: HTMLCanvasElement;
    private state: GameState;

    // Panning
    private isDragging = false;
    private lastX = 0;
    private lastY = 0;
    private startX = 0;
    private startY = 0;

    // Interaction callbacks
    public onTileSelect?: (x: number, y: number) => void;

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
        this.startX = x;
        this.startY = y;
        this.isDragging = false;
        this.lastX = x;
        this.lastY = y;
    }

    public handleMove(x: number, y: number) {
        const dist = Math.abs(x - this.startX) + Math.abs(y - this.startY);
        if (dist > 10) {
            this.isDragging = true;
        }

        if (this.isDragging) {
            const dx = x - this.lastX;
            const dy = y - this.lastY;
            this.state.camera.x += dx;
            this.state.camera.y += dy;
            this.lastX = x;
            this.lastY = y;
        }
    }

    public handleEnd(x: number, y: number) {
        if (!this.isDragging) {
            this.handleClick(x, y);
        }
        this.isDragging = false;
    }

    private handleClick(screenX: number, screenY: number) {
        const { state } = this;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const canvasX = (screenX - rect.left) * scaleX;
        const canvasY = (screenY - rect.top) * scaleY;

        // Camera Transform Reverse
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const worldX_cam = canvasX - centerX - state.camera.x;
        const worldY_cam = canvasY - centerY - state.camera.y;

        const boardW = state.map.width * TILE_SIZE;
        const boardH = state.map.height * TILE_SIZE;
        const worldX = worldX_cam + boardW / 2;
        const worldY = worldY_cam + boardH / 2;

        const tileX = Math.floor(worldX / TILE_SIZE);
        const tileY = Math.floor(worldY / TILE_SIZE);

        this.onTileSelect?.(tileX, tileY);
    }
}
