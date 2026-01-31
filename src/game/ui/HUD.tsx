import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { gameManager } from '../GameManager';
import { t, Language } from '../data/translations';

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
    const lang = state.language;

    const handleNextWave = () => {
        gameManager.loop.startNextWave();
    };

    const handlePause = () => {
        gameManager.togglePause();
    };

    return (
        <>
            <div className="absolute top-0 right-0 w-full p-4 pointer-events-none flex justify-end items-start select-none z-[60]">
                {/* Single Right Column for HUD */}
                <div className="flex flex-col gap-3 pointer-events-auto items-end">

                    {/* Top Row: Wave Info/Button & Money/Lives */}
                    <div className="flex items-center gap-3">
                        {/* Wave Info + Start Button */}
                        <button
                            onClick={!state.waveActive ? handleNextWave : undefined}
                            className={`px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 min-w-[120px] border transition-all active:scale-95 text-left
                            ${!state.waveActive
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 border-white/20 hover:from-emerald-500 hover:to-teal-400 animate-pulse'
                                    : 'bg-black/40 backdrop-blur-md border-white/10 opacity-90'}`}
                        >
                            <WaveIcon />
                            <div className="flex flex-col leading-none">
                                <span className={`text-[10px] font-bold uppercase tracking-wider opacity-70 ${!state.waveActive ? 'text-white' : 'text-cyan-200'}`}>
                                    {t('ui.season', lang)} {Math.ceil(state.wave / 10)}
                                </span>
                                <span className={`text-xl font-black ${!state.waveActive ? 'text-white' : 'text-white'}`}>
                                    {t('ui.wave', lang)} {state.wave % 10 || 10}
                                </span>
                            </div>
                        </button>

                        {/* Gold */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-5 py-2 rounded-2xl shadow-xl flex items-center gap-3">
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-[10px] text-yellow-200 font-bold uppercase tracking-wider opacity-70">{t('ui.treasury', lang)}</span>
                                <span className="text-xl font-black text-yellow-400 tabular-nums">{state.gold}</span>
                            </div>
                            <GoldIcon />
                        </div>

                        {/* Lives */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3">
                            <HeartIcon />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-rose-200 font-bold uppercase tracking-wider opacity-70">{t('ui.lives', lang)}</span>
                                <span className={`text-xl font-black ${state.lives < 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{state.lives}</span>
                            </div>
                        </div>
                    </div>

                    {/* Second Row: Language & Control Row */}
                    <div className="flex items-center gap-3">
                        {/* Language Selector */}
                        <div className="flex gap-1 bg-black/40 backdrop-blur-md p-1.5 rounded-xl border border-white/5">
                            {(['ko', 'en', 'ja', 'zh', 'es'] as Language[]).map(l => (
                                <button
                                    key={l}
                                    onClick={() => gameManager.setLanguage(l)}
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all
                                    ${state.language === l ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                                >
                                    {l.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Speed/Pause/Restart Controls */}
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => gameManager.toggleSpeed()}
                                className={`w-10 h-10 rounded-xl backdrop-blur-md border flex items-center justify-center font-black text-xs transition-all active:scale-90
                                ${state.speed === 2
                                        ? 'bg-cyan-500/40 border-cyan-400/50 text-cyan-100 shadow-lg shadow-cyan-500/20'
                                        : 'bg-white/10 border-white/10 text-white/70 hover:bg-white/20'}`}
                                title={t('ui.speed', lang)}
                            >
                                {state.speed}x
                            </button>

                            <button
                                onClick={handlePause}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-90"
                            >
                                {state.paused ? '▶' : 'II'}
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-red-500/30 flex items-center justify-center text-red-200 transition-all active:scale-90"
                                title="Restart Game"
                            >
                                ↻
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Over Overlay */}
            {state.lives <= 0 && (
                <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-fade-in pointer-events-auto">
                    <div className="text-rose-500 text-7xl font-black tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]">
                        {t('ui.gameOver', lang)}
                    </div>
                    <p className="text-slate-400 text-xl font-medium mb-12">{t('ui.breached', lang)}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white text-black font-black py-4 px-12 rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-3 text-xl shadow-xl"
                    >
                        <span>{t('ui.tryAgain', lang)}</span>
                        <span className="text-2xl">↻</span>
                    </button>
                </div>
            )}

            {/* Pause Overlay */}
            {state.paused && state.lives > 0 && (
                <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-8 pointer-events-auto">
                    <div className="text-white text-6xl font-black tracking-widest uppercase mb-12 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                        {t('ui.paused', lang)}
                    </div>

                    <button
                        onClick={handlePause}
                        className="bg-white text-black font-black py-4 px-12 rounded-2xl hover:bg-cyan-100 transition-all active:scale-95 flex items-center gap-3 text-xl shadow-2xl"
                    >
                        <span>{t('ui.resume', lang)}</span>
                        <span className="text-2xl font-normal">▶</span>
                    </button>
                </div>
            )}
        </>
    );
}
