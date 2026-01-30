'use client';

import React, { useEffect, useRef } from 'react';
import { gameManager } from '@/game/GameManager';
import HUD from '@/game/ui/HUD';
import TowerControls from '@/game/ui/TowerControls';

export default function GamePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // Resize handling
        const resize = () => {
            if (!canvasRef.current || !containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            // High DPI
            const dpr = window.devicePixelRatio || 1;
            canvasRef.current.width = clientWidth * dpr;
            canvasRef.current.height = clientHeight * dpr;
            canvasRef.current.style.width = `${clientWidth}px`;
            canvasRef.current.style.height = `${clientHeight}px`;

            // Update Renderer
            gameManager.renderer?.setSize(canvasRef.current.width, canvasRef.current.height);
        };

        window.addEventListener('resize', resize);
        resize();

        // Init Game
        gameManager.init(canvasRef.current);

        const cleanup = () => {
            gameManager.cleanup();
            window.removeEventListener('resize', resize);
        };

        // Prevent default touch actions (scrolling)
        const preventDefault = (e: Event) => e.preventDefault();
        canvasRef.current.addEventListener('touchstart', preventDefault, { passive: false });
        canvasRef.current.addEventListener('touchmove', preventDefault, { passive: false });

        return cleanup;
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[100dvh] bg-slate-950 overflow-hidden touch-none">
            {/* Background Grid Pattern (Optional CSS) */}
            <div className="absolute inset-0 bg-[#0f172a]" />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 block touch-none"
            />

            <HUD />
            <TowerControls />
        </div>
    );
}
