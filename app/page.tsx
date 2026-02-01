'use client';

import React, { useEffect, useRef } from 'react';
import { gameManager } from '@/game/GameManager';
import { useGameState } from '@/game/hooks/useGameState';
import HUD from '@/game/ui/HUD';
import TowerControls from '@/game/ui/TowerControls';
import AdUnit from '@/game/ui/AdUnit';

export default function GamePage() {
    const state = useGameState();
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

            {/* Desktop Vertical Ad Unit (Between Sidebar and Board) */}
            <div className="fixed top-0 bottom-0 left-[240px] z-10 hidden lg:flex flex-col w-[160px] pointer-events-auto bg-black/20 border-r border-white/5 overflow-hidden backdrop-blur-sm">
                <div className="p-1 text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center border-b border-white/5 bg-black/40">Advertisement</div>
                <div className="flex-1 flex items-center justify-center p-2">
                    <AdUnit adSlot="7585529595" adFormat="auto" />
                </div>
            </div>

            {/* Mobile Horizontal Ad Unit (Bottom of screen) */}
            <div className={`fixed bottom-0 left-0 right-0 z-10 lg:hidden flex flex-col bg-black/40 border-t border-white/10 transition-transform duration-300 ${state.selection ? 'translate-y-[-140px]' : 'translate-y-0'}`}>
                <div className="flex items-center justify-center p-1 bg-black/20">
                    <AdUnit adSlot="7585529595" adFormat="horizontal" fullWidthResponsive={false} style={{ display: 'inline-block', width: '320px', height: '50px' }} />
                </div>
            </div>
        </div>
    );
}
