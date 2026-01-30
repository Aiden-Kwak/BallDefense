'use client';

import { useEffect, useRef } from 'react';
import { gameManager } from '../game/GameManager';
import HUD from '../game/ui/HUD';
import TowerControls from '../game/ui/TowerControls';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Initialize Game
      gameManager.init(canvasRef.current);

      // Handle Resize for 1:1 pixel mapping
      const handleResize = () => {
        if (canvasRef.current) {
          const w = window.innerWidth;
          const h = window.innerHeight;

          // Set actual canvas size (internal resolution)
          canvasRef.current.width = w;
          canvasRef.current.height = h;

          // Update Renderer size
          gameManager.renderer?.setSize(w, h);

          // Trigger re-render
          gameManager.renderer?.render(gameManager.state);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Initial setup

      return () => {
        window.removeEventListener('resize', handleResize);
        gameManager.cleanup();
      };
    }
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* UI Overlays */}
      <TowerControls />
      <HUD />
    </main>
  );
}
