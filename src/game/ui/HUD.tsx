import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { gameManager } from '../GameManager';

// Inline SVGs for lightweight icons
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-rose-500 drop-shadow-lg">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
);

const GoldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400 drop-shadow-lg">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.656c-.483.334-1.032.56-1.605.652a.75.75 0 00-.615.741v.001c0 .357.243.668.586.743.605.135 1.25.306 1.838.495.27.087.496.223.662.399.232.246.353.56.353.896 0 .337-.121.65-.353.896-.166.176-.392.312-.662.4-.588.188-1.233.36-1.838.494a.756.756 0 00-.586.744v.001c0 .363.26.685.615.74.573.093 1.122.319 1.605.653.4.277.92.533 1.72.656V18a.75.75 0 001.5 0v-.816a3.836 3.836 0 001.72-.656c.483-.334 1.032-.56 1.605-.652a.75.75 0 00.615-.741v-.001a.756.756 0 00-.586-.743c-.605-.135-1.25-.306-1.838-.495-.27-.087-.496-.223-.662-.399-.232-.246-.353-.56-.353-.896 0-.337.121-.65.353-.896.166-.176.392-.312.662-.4.588-.188 1.233-.36 1.838-.494a.756.756 0 00.586-.744v-.001c0-.363-.26-.685-.615-.74-.573-.093-1.122-.319-1.605-.653-.4-.277-.92-.533-1.72-.656V6z" clipRule="evenodd" />
    </svg>
);

const WaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-cyan-400 drop-shadow-lg">
        <path d="M2.25 15c.915-2.071 2.502-3.75 4.5-3.75 2.5 0 3.5 2.5 5.5 2.5s3-2.5 5.5-2.5c1.998 0 3.585 1.679 4.5 3.75" />
    </svg>
);

export default function HUD() {
    const state = useGameState();

    const handleNextWave = () => {
        gameManager.loop.startNextWave();
    };

    const handlePause = () => {
        gameManager.togglePause();
    };

    return (
        <>
            <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start select-none z-10">
                {/* Left Pill: Wave & Lives */}
                <div className="flex flex-col gap-3 pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 min-w-[120px]">
                            <WaveIcon />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider opacity-70">Defense</span>
                                <span className="text-xl font-black text-white">WAVE {state.wave}</span>
                            </div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3">
                            <HeartIcon />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-rose-200 font-bold uppercase tracking-wider opacity-70">Lives</span>
                                <span className={`text-xl font-black ${state.lives < 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{state.lives}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Pill: Gold & Controls */}
                <div className="flex flex-col gap-3 pointer-events-auto items-end">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-5 py-2 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-[10px] text-yellow-200 font-bold uppercase tracking-wider opacity-70">Treasury</span>
                            <span className="text-xl font-black text-yellow-400 tabular-nums">{state.gold}</span>
                        </div>
                        <GoldIcon />
                    </div>

                    <button
                        onClick={handlePause}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-90"
                    >
                        {state.paused ? '▶' : 'II'}
                    </button>

                    <button
                        onClick={() => gameManager.resetGame()}
                        className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-red-500/30 flex items-center justify-center text-red-200 transition-all active:scale-90"
                        title="Restart Game"
                    >
                        ↻
                    </button>
                </div>
            </div>

            {/* Center Status / Start Button */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full px-8 pointer-events-none z-20 flex justify-center flex-col items-center gap-4">

                {/* AUTO START COUNTDOWN (Removed as per request for immediate transition) */}
                {/* 
                {state.waveState.intermissionTimer > 0 && !state.waveActive && (
                    <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 animate-pulse text-center">
                        <div className="text-cyan-400 font-bold text-sm tracking-widest uppercase mb-1">Next Wave In</div>
                        <div className="text-4xl font-black text-white">{Math.ceil(state.waveState.intermissionTimer)}</div>
                    </div>
                )}
                */}

                {/* START BUTTON (Only for Wave 1) */}
                {!state.waveActive && state.wave === 1 && state.waveState.intermissionTimer <= 0 && (
                    <button
                        onClick={handleNextWave}
                        className="pointer-events-auto group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold py-3 px-10 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/20 transition-all active:scale-95 animate-bounce-subtle"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="text-lg tracking-widest">START GAME</span>
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                )}

                {/* WAVE STATUS (During Wave) */}
                {state.waveActive && (
                    <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                        <span className="text-xl font-black text-white tracking-widest">WAVE {state.wave}</span>
                    </div>
                )}
            </div>

            {/* Pause Overlay */}
            {state.paused && (
                <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                    <div className="text-4xl font-black text-white tracking-widest uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">PAUSED</div>
                </div>
            )}
        </>
    );
}
