import { GameState } from '../state/GameState';
import { TILE_SIZE } from '../constants';

export class InputHandler {
    private canvas: HTMLCanvasElement;
    private state: GameState;

    // Panning (Disabled by user request)
    private isDown = false;

    // ...

    public handleStart(x: number, y: number) {
        this.isDown = true;
    }

    public handleMove(x: number, y: number) {
        // No Camera Movement
    }

    public handleEnd(x: number, y: number) {
        if (this.isDown) {
            this.handleClick(x, y);
        }
        this.isDown = false;
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
