import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { gameManager } from '../GameManager';
import { t, Language } from '../data/translations';

// Inline SVGs for lightweight icons
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-rose-500">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
);

const GoldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-yellow-400">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.656c-.483.334-1.032.56-1.605.652a.75.75 0 00-.615.741v.001c0 .357.243.668.586.743.605.135 1.25.306 1.838.495.27.087.496.223.662.399.232.246.353.56.353.896 0 .337-.121.65-.353.896-.166.176-.392.312-.662.4-.588.188-1.233.36-1.838.494a.756.756 0 00-.586.744v.001c0 .363.26.685.615.74.573.093 1.122.319 1.605.653.4.277.92.533 1.72.656V18a.75.75 0 001.5 0v-.816a3.836 3.836 0 001.72-.656c.483-.334 1.032-.56 1.605-.652a.75.75 0 00.615-.741v-.001a.756.756 0 00-.586-.743c-.605-.135-1.25-.306-1.838-.495-.27-.087-.496-.223-.662-.399-.232-.246-.353-.56-.353-.896 0-.337.121-.65.353-.896.166-.176.392-.312.662-.4.588-.188 1.233-.36 1.838-.494a.756.756 0 00.586-.744v-.001c0-.363-.26-.685-.615-.74-.573-.093-1.122-.319-1.605-.653-.4-.277-.92-.533-1.72-.656V6z" clipRule="evenodd" />
    </svg>
);

const WaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-cyan-400">
        <path d="M2.25 15c.915-2.071 2.502-3.75 4.5-3.75 2.5 0 3.5 2.5 5.5 2.5s3-2.5 5.5-2.5c1.998 0 3.585 1.679 4.5 3.75" />
    </svg>
);

export default function HUD() {
    const state = useGameState();
    const lang = state.language;

    const handleNextWave = () => {
        gameManager.loop.startNextWave();
    };

    const handlePause = () => {
        gameManager.togglePause();
    };

    // Responsive Logic: 
    // Desktop (lg): Right-aligned stack
    // Mobile: Stats at top, Controls stacked below or right

    return (
        <>
            <div className="absolute top-0 right-0 w-full p-2 lg:p-4 pointer-events-none flex flex-col items-end gap-1.5 active:z-50 z-[60]">
                {/* Stats Row: Very compact on mobile */}
                <div className="flex items-center gap-1.5 lg:gap-3 pointer-events-auto">
                    {/* Wave Info + Start Button */}
                    <button
                        onClick={!state.waveActive ? handleNextWave : undefined}
                        className={`px-2 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-2xl shadow-xl flex items-center gap-1.5 lg:gap-3 border transition-all active:scale-95
                        ${!state.waveActive
                                ? 'bg-emerald-600/90 lg:bg-gradient-to-r lg:from-emerald-600 lg:to-teal-500 border-white/20 hover:bg-emerald-500 animate-pulse'
                                : 'bg-black/40 backdrop-blur-md border-white/10'}`}
                    >
                        {!state.waveActive ? (
                            <span className="text-white text-xs lg:text-xl font-black px-2 lg:px-4">
                                {t('ui.start', lang)}
                            </span>
                        ) : (
                            <>
                                <WaveIcon />
                                <div className="flex items-baseline gap-1 lg:flex-col lg:leading-none lg:gap-0">
                                    <span className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-wider opacity-60 text-cyan-200`}>
                                        {state.wave % 10 || 10}
                                    </span>
                                    <span className="text-xs lg:text-xl font-black text-white">
                                        {t('ui.wave', lang)} {state.wave}
                                    </span>
                                </div>
                            </>
                        )}
                    </button>

                    {/* Gold */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-2 lg:px-5 py-1 lg:py-2 rounded-lg lg:rounded-2xl shadow-xl flex items-center gap-1.5 lg:gap-3">
                        <GoldIcon />
                        <span className="text-xs lg:text-xl font-black text-yellow-400 tabular-nums">{state.gold}</span>
                    </div>

                    {/* Lives */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-2 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-2xl shadow-xl flex items-center gap-1.5 lg:gap-3">
                        <HeartIcon />
                        <span className={`text-xs lg:text-xl font-black ${state.lives < 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{state.lives}</span>
                    </div>
                </div>

                {/* Controls Row: Compact on mobile */}
                <div className="flex items-center gap-1.5 lg:gap-3 pointer-events-auto">
                    {/* Language Selector */}
                    <div className="flex gap-0.5 bg-black/40 backdrop-blur-md p-1 rounded-lg border border-white/5">
                        {(['ko', 'en', 'ja', 'zh', 'es'] as Language[]).map(l => (
                            <button
                                key={l}
                                onClick={() => gameManager.setLanguage(l)}
                                className={`w-5 h-5 lg:w-7 lg:h-7 flex items-center justify-center rounded text-[8px] lg:text-[10px] font-bold transition-all
                                ${state.language === l ? 'bg-white text-black' : 'text-white/40 hover:text-white/70'}`}
                            >
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Utility Controls */}
                    <div className="flex gap-1 lg:gap-2">
                        <button
                            onClick={() => gameManager.toggleSpeed()}
                            className={`w-7 h-7 lg:w-10 lg:h-10 rounded-lg backdrop-blur-md border flex items-center justify-center font-black text-[9px] lg:text-xs transition-all
                            ${state.speed === 2
                                    ? 'bg-cyan-500/40 border-cyan-400/50 text-cyan-100'
                                    : 'bg-white/10 border-white/10 text-white/50'}`}
                        >
                            {state.speed}x
                        </button>

                        <button
                            onClick={handlePause}
                            className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white text-[10px] lg:text-base"
                        >
                            {state.paused ? '▶' : 'II'}
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-red-500/30 flex items-center justify-center text-red-200 text-[10px] lg:text-base"
                        >
                            ↻
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlays */}
            {state.lives <= 0 && (
                <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 lg:p-8 animate-fade-in pointer-events-auto text-center">
                    <div className="text-rose-500 text-3xl lg:text-7xl font-black tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]">
                        {t('ui.gameOver', lang)}
                    </div>
                    <p className="text-slate-400 text-xs lg:text-xl font-medium mb-6">{t('ui.breached', lang)}</p>
                    <button onClick={() => window.location.reload()} className="bg-white text-black font-black py-2.5 lg:py-4 px-6 lg:px-12 rounded-xl text-sm lg:text-xl shadow-xl">
                        {t('ui.tryAgain', lang)} ↻
                    </button>
                </div>
            )}

            {state.paused && state.lives > 0 && (
                <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-4 lg:p-8 pointer-events-auto text-center">
                    <div className="text-white text-3xl lg:text-6xl font-black tracking-widest uppercase mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                        {t('ui.paused', lang)}
                    </div>
                    <button onClick={handlePause} className="bg-white text-black font-black py-2.5 lg:py-4 px-6 lg:px-12 rounded-xl text-sm lg:text-xl shadow-2xl">
                        {t('ui.resume', lang)} ▶
                    </button>
                </div>
            )}
        </>
    );
}
