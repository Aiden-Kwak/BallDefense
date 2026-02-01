import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { gameManager } from '../GameManager';
import { t, Language } from '../data/translations';
import { TOWERS } from '../data/towers';
import { ENEMIES } from '../data/enemies';

// Inline SVGs for lightweight icons
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-rose-500">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
);

const GoldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-yellow-400">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.656c-.483.334-1.032.56-1.605.652a.75.75 0 00-.615.741v.001c0 .357.243.668.586.743.605.135 1.25.306 1.838.495.27.087.496.223.662.399.232.246.353.56.353.896 0 .337-.121.65-.353.896-.166.176-.392.312-.662.4-.588.188-1.233.36-1.838.494a.756.756 0 00-.586.744v.001c0 .363.26.685.615.74.573.093 1.122.319 1.605.653.4.277.92.533 1.72.656V18a.75.75 0 001.5 0v-.816a3.836 3.836 0 001.72-.656c.483-.334 1.032-.56 1.605-.652a.75.75 0 00.615-.741v-.001a.756.756 0 00-.586-.743c-.605-.135-1.25-.306-1.838-.495-.27-.087-.496-.223-.662-.399-.232-.246-.353-.56-.353-.896 0-.337.121-.65.353-.896.166-.176.392-.312.662-.4.588.188-1.233.36 1.838-.494a.756.756 0 00.586-.744v-.001c0-.363-.26-.685-.615-.74-.573-.093-1.122-.319-1.605-.653-.4-.277-.92-.533-1.72-.656V6z" clipRule="evenodd" />
    </svg>
);

const WaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-cyan-400">
        <path d="M2.25 15c.915-2.071 2.502-3.75 4.5-3.75 2.5 0 3.5 2.5 5.5 2.5s3-2.5 5.5-2.5c1.998 0 3.585 1.679 4.5 3.75" />
    </svg>
);

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 lg:w-5 lg:h-5">
        <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 01.75-.75h15a.75.75 0 01.75.75v8.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-8.25z" />
    </svg>
);

// --- Tower Shape SVGs (Same as TowerControls) ---
const TowerShape = ({ type, color }: { type: string, color: string }) => {
    switch (type) {
        case 'ARROW': return <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M20 5 L35 32 L5 32 Z" fill={color} stroke="white" strokeWidth="1" /></svg>;
        case 'CANNON': return <svg viewBox="0 0 40 40" className="w-full h-full"><rect x="8" y="8" width="24" height="24" fill={color} stroke="white" strokeWidth="1" /></svg>;
        case 'FROST': return <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M20 5 L33 12.5 L33 27.5 L20 35 L7 27.5 L7 12.5 Z" fill={color} stroke="white" strokeWidth="1" /></svg>;
        case 'POISON': return <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M20 5 L33 20 L20 35 L7 20 Z" fill={color} stroke="white" strokeWidth="1" /></svg>;
        case 'ARCANE': return <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M20 2 L25 15 L38 15 L28 24 L32 37 L20 30 L8 37 L12 24 L2 15 L15 15 Z" fill={color} stroke="white" strokeWidth="1" /></svg>;
        case 'TESLA': return <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M15 5 L25 18 L18 18 L28 35 L12 21 L19 21 Z" fill={color} stroke="white" strokeWidth="1" /></svg>;
        case 'SNIPER': return <svg viewBox="0 0 40 40" className="w-full h-full"><circle cx="20" cy="20" r="14" fill={color} stroke="white" strokeWidth="1" /><line x1="20" y1="6" x2="20" y2="34" stroke="white" strokeWidth="1" opacity="0.5" /><line x1="6" y1="20" x2="34" y2="20" stroke="white" strokeWidth="1" opacity="0.5" /></svg>;
        case 'STICKY': return <svg viewBox="0 0 40 40" className="w-full h-full"><circle cx="20" cy="20" r="13" fill={color} stroke="white" strokeWidth="1" /><circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.2)" /></svg>;
        default: return null;
    }
};

const getTowerColor = (typeId: string): string => {
    switch (typeId) {
        case 'ARROW': return '#3b82f6';
        case 'CANNON': return '#ef4444';
        case 'FROST': return '#22d3ee';
        case 'POISON': return '#10b981';
        case 'ARCANE': return '#a855f7';
        case 'TESLA': return '#fbbf24';
        default: return '#94a3b8';
    }
};

const getEnemyColor = (typeId: string): string => {
    switch (typeId) {
        case 'GRUNT': return '#94a3b8';
        case 'RUNNER': return '#fbbf24';
        case 'BRUTE': return '#10b981';
        case 'WARDED': return '#a855f7';
        case 'SWARM': return '#f97316';
        case 'MINI': return '#fdba74';
        case 'SHIELDED': return '#ec4899';
        case 'COREBREAKER': return '#ef4444';
        case 'DASHLING': return '#22d3ee';
        case 'NEST': return '#8b5cf6';
        case 'TANKER': return '#4ade80';
        default: return '#ffffff';
    }
};

export default function HUD() {
    const state = useGameState();
    const lang = state.language;
    const [showGuide, setShowGuide] = React.useState(false);

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
                    {/* Encyclopedia Button */}
                    <button
                        onClick={() => setShowGuide(true)}
                        className="p-1.5 lg:p-3 rounded-lg lg:rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-cyan-400 hover:text-white transition-colors shadow-xl"
                        title={t('ui.guide', lang)}
                    >
                        <BookIcon />
                    </button>

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

            {/* Encyclopedia Overlay */}
            {showGuide && (
                <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 pointer-events-auto">
                    <div className="w-full max-w-4xl max-h-full bg-slate-900/50 border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-fade-in">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 lg:p-8 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 lg:p-4 rounded-2xl bg-cyan-500/20 text-cyan-400">
                                    <BookIcon />
                                </div>
                                <h2 className="text-xl lg:text-4xl font-black text-white uppercase tracking-tight">{t('ui.guide', lang)}</h2>
                            </div>
                            <button onClick={() => setShowGuide(false)} className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-xl transition-all">✕</button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar space-y-8 lg:space-y-12">
                            {/* Records Section */}
                            <section className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-4 lg:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <h3 className="text-sm lg:text-xl font-black text-amber-400 uppercase tracking-widest pl-2 border-l-4 border-amber-500">{t('ui.records', lang)}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3 lg:gap-6">
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-3 lg:p-6 rounded-2xl flex flex-col items-center text-center">
                                        <span className="text-[10px] lg:text-xs font-black text-slate-500 uppercase mb-2">{t('ui.bestWave', lang)}</span>
                                        <span className="text-2xl lg:text-5xl font-black text-white glow-amber">{state.bestStats.wave}</span>
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-3 lg:p-6 rounded-2xl flex flex-col items-center text-center">
                                        <span className="text-[10px] lg:text-xs font-black text-slate-500 uppercase mb-2">{t('ui.totalKills', lang)}</span>
                                        <span className="text-2xl lg:text-5xl font-black text-white glow-amber">{state.bestStats.enemiesKilled}</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="text-[8px] lg:text-xs text-slate-400 opacity-60 italic">— {t('ui.currentKills', lang)}: {state.stats.enemiesKilled} —</span>
                                </div>
                            </section>

                            {/* Towers Section */}
                            <section>
                                <h3 className="text-sm lg:text-xl font-black text-cyan-400 uppercase tracking-widest mb-4 lg:mb-6 pl-2 border-l-4 border-cyan-500">{t('ui.towers', lang)}</h3>
                                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                                    {Object.values(TOWERS).map((tower) => {
                                        return (
                                            <div key={tower.id} className="p-3 lg:p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-4 lg:gap-6">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-2xl bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-inner">
                                                        <TowerShape type={tower.id} color={getTowerColor(tower.id)} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-black text-base lg:text-2xl mb-1">{t(`tower.${tower.id}`, lang)}</h4>
                                                        <p className="text-slate-400 text-xs lg:text-base leading-snug">{t(`tower.desc.${tower.id}`, lang)}</p>
                                                    </div>
                                                </div>

                                                {/* Tiers Comparison */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4 pt-4 border-t border-white/10">
                                                    {tower.tiers.map((tier, idx) => (
                                                        <div key={idx} className="bg-black/20 rounded-2xl p-3 border border-white/5">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">LV{idx + 1}</span>
                                                                <span className="text-yellow-400 font-mono text-xs lg:text-sm font-bold">{tier.stats.cost}G</span>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between text-[10px] lg:text-xs">
                                                                    <span className="text-slate-500 uppercase font-black">DMG</span>
                                                                    <span className="text-white font-mono">{tier.stats.damage}</span>
                                                                </div>
                                                                <div className="flex justify-between text-[10px] lg:text-xs">
                                                                    <span className="text-slate-500 uppercase font-black">RATE</span>
                                                                    <span className="text-white font-mono">{tier.stats.fireRate}/s</span>
                                                                </div>
                                                                <div className="flex justify-between text-[10px] lg:text-xs">
                                                                    <span className="text-slate-500 uppercase font-black">RANGE</span>
                                                                    <span className="text-white font-mono">{tier.stats.range}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Enemies Section */}
                            <section>
                                <h3 className="text-sm lg:text-xl font-black text-rose-400 uppercase tracking-widest mb-4 lg:mb-6 pl-2 border-l-4 border-rose-500">{t('ui.enemies', lang)}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 pb-8">
                                    {Object.values(ENEMIES).filter((e: any) => e.id !== 'MINI').map((enemy: any) => (
                                        <div key={enemy.id} className="p-3 lg:p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                    <div className="w-6 h-6 lg:w-8 lg:h-8 rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: getEnemyColor(enemy.id), borderRadius: enemy.id === 'BRUTE' ? '4px' : '50%' }}></div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-white font-bold text-sm lg:text-lg mb-0.5">{t(`enemy.${enemy.id}`, lang)}</h4>
                                                        <span className="text-yellow-400 font-mono text-[10px] lg:text-sm font-bold">+{enemy.baseStats.reward}G</span>
                                                    </div>
                                                    <p className="text-slate-400 text-xs lg:text-sm leading-tight">{t(`enemy.desc.${enemy.id}`, lang)}</p>
                                                </div>
                                            </div>
                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-4 gap-1 lg:gap-2 pt-3 border-t border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-black">HP</span>
                                                    <span className="text-xs lg:text-base text-rose-400 font-mono">{enemy.baseStats.hp}</span>
                                                </div>
                                                <div className="flex flex-col border-l border-white/5 pl-2">
                                                    <span className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-black">SPD</span>
                                                    <span className="text-xs lg:text-base text-cyan-400 font-mono">{enemy.baseStats.speed}</span>
                                                </div>
                                                <div className="flex flex-col border-l border-white/5 pl-2">
                                                    <span className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-black">ARR</span>
                                                    <span className="text-xs lg:text-base text-white/70 font-mono">{enemy.baseStats.armor}</span>
                                                </div>
                                                <div className="flex flex-col border-l border-white/5 pl-2">
                                                    <span className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-black">MR</span>
                                                    <span className="text-xs lg:text-base text-white/70 font-mono">{enemy.baseStats.mr}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Build/Upgrade Overlays */}
            {state.lives <= 0 && (
                <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 lg:p-8 animate-fade-in pointer-events-auto text-center">
                    <div className="text-rose-500 text-3xl lg:text-7xl font-black tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]">
                        {t('ui.gameOver', lang)}
                    </div>
                    <p className="text-slate-400 text-xs lg:text-xl font-medium mb-8">{t('ui.breached', lang)}</p>

                    {/* Records Panel */}
                    <div className="grid grid-cols-2 gap-4 mb-10 w-full max-w-sm lg:max-w-md">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                            <div className="text-[10px] lg:text-xs font-black text-slate-500 uppercase mb-1">{t('ui.totalKills', lang)}</div>
                            <div className="text-xl lg:text-3xl font-black text-white">{state.stats.enemiesKilled}</div>
                            {state.stats.enemiesKilled >= state.bestStats.enemiesKilled && state.stats.enemiesKilled > 0 && (
                                <div className="text-[8px] lg:text-[10px] font-bold text-amber-400 mt-1">★ {t('ui.newRecord', lang)}</div>
                            )}
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                            <div className="text-[10px] lg:text-xs font-black text-slate-500 uppercase mb-1">{t('ui.bestWave', lang)}</div>
                            <div className="text-xl lg:text-3xl font-black text-white">{state.wave}</div>
                            {state.wave >= state.bestStats.wave && (
                                <div className="text-[8px] lg:text-[10px] font-bold text-amber-400 mt-1">★ {t('ui.newRecord', lang)}</div>
                            )}
                        </div>
                    </div>

                    <button onClick={() => window.location.reload()} className="bg-white text-black font-black py-2.5 lg:py-4 px-6 lg:px-12 rounded-xl text-sm lg:text-xl shadow-xl hover:scale-105 transition-transform active:scale-95">
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
