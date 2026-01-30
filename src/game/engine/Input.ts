import { GameState } from '../state/GameState';
import { TILE_SIZE } from '../constants';

export class InputHandler {
    private canvas: HTMLCanvasElement;
    private state: GameState;

    // Panning (Disabled by user request)
    private isDown = false;

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
            // this.handleMove(t.clientX, t.clientY); // Disabled move
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

    public handleMove(x: number, y: number) {
        // No Camera Movement
    }

    public handleEnd(x: number, y: number) {
        if (this.isDown) { // Simple click detection (no drag check needed as drag is disabled)
            this.handleClick(x, y);
        }
        this.isDown = false;
    }

    private handleClick(screenX: number, screenY: number) {
        // NOTE: screenX/Y from clientX/Y can be tricky with scaling.
        // We really want offset relative to the canvas element.
        // Since we can't easily get offsetX from here without the event, 
        // let's rely on the fact that the canvas is full screen (w/h = window.w/h).
        // BUT, to be absolutely safe and match Renderer exactly:

        const rect = this.canvas.getBoundingClientRect();

        // Canvas Internal Resolution
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;

        // CSS Resolution
        const cssW = rect.width;
        const cssH = rect.height;

        // Scale factors (should be 1 if page.tsx logic works, but safeguards are good)
        const scaleX = canvasW / cssW;
        const scaleY = canvasH / cssH;

        // Position within canvas (internal pixels)
        const canvasX = (screenX - rect.left) * scaleX;
        const canvasY = (screenY - rect.top) * scaleY;

        // --- Renderer Logic Sync ---
        // Renderer: const paddingX = SIDEBAR_WIDTH + (playableW - boardW) / 2;
        //           ctx.translate(paddingX, paddingY);

        const { state } = this;
        const SIDEBAR_WIDTH = 260;
        const boardW = state.map.width * TILE_SIZE;
        const boardH = state.map.height * TILE_SIZE;

        // IMPORTANT: Use canvasW, not this.canvas.width property directly if it differs
        const playableW = canvasW - SIDEBAR_WIDTH; // Width remaining for board

        const paddingX = SIDEBAR_WIDTH + (playableW - boardW) / 2;
        const paddingY = (canvasH - boardH) / 2;

        const worldX = canvasX - paddingX;
        const worldY = canvasY - paddingY;

        const tileX = Math.floor(worldX / TILE_SIZE);
        const tileY = Math.floor(worldY / TILE_SIZE);

        this.onTileSelect?.(tileX, tileY);
    }
}
