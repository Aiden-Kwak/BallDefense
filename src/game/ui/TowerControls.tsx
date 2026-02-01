import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { gameManager } from '../GameManager';
import { TOWERS } from '../data/towers';
import { t } from '../data/translations';

// --- Tower Shape SVGs (Matching Renderer.ts Logic) ---

const TowerIcon = ({ type, color }: { type: string, color: string }) => {
    switch (type) {
        case 'ARROW': // Triangle
            return (
                <svg viewBox="0 0 40 40" className="w-full h-full p-2 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                    <path d="M20 5 L35 32 L5 32 Z" fill={color} stroke="white" strokeWidth="1" />
                </svg>
            );
        case 'CANNON': // Square
            return (
                <svg viewBox="0 0 40 40" className="w-full h-full p-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                    <rect x="8" y="8" width="24" height="24" fill={color} stroke="white" strokeWidth="1" />
                </svg>
            );
        case 'FROST': // Hexagon
            return (
                <svg viewBox="0 0 40 40" className="w-full h-full p-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                    <path d="M20 5 L33 12.5 L33 27.5 L20 35 L7 27.5 L7 12.5 Z" fill={color} stroke="white" strokeWidth="1" />
                </svg>
            );
        case 'POISON': // Diamond
            return (
                <svg viewBox="0 0 40 40" className="w-full h-full p-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                    <path d="M20 5 L33 20 L20 35 L7 20 Z" fill={color} stroke="white" strokeWidth="1" />
                </svg>
            );
        case 'ARCANE': // Star (Simplified)
            return (
                <svg viewBox="0 0 40 40" className="w-full h-full p-1.5 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                    <path d="M20 2 L25 15 L38 15 L28 24 L32 37 L20 30 L8 37 L12 24 L2 15 L15 15 Z" fill={color} stroke="white" strokeWidth="1" />
                </svg>
            );
        case 'TESLA': // Lightning
            return (
                <svg viewBox="0 0 40 40" className="w-full h-full p-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                    <path d="M15 5 L25 18 L18 18 L28 35 L12 21 L19 21 Z" fill={color} stroke="white" strokeWidth="1" />
                </svg>
            );
        case 'SNIPER': // Sniper tower defaults to Circle in Renderer, but let's give it a precise crosshair-ish look or stay consistent
            return (
                <svg viewBox="0 0 40 40" className="w-full h-full p-2 drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]">
                    <circle cx="20" cy="20" r="14" fill={color} stroke="white" strokeWidth="1" />
                    <line x1="20" y1="6" x2="20" y2="34" stroke="white" strokeWidth="1" opacity="0.5" />
                    <line x1="6" y1="20" x2="34" y2="20" stroke="white" strokeWidth="1" opacity="0.5" />
                </svg>
            );
        case 'STICKY': // Circle
            return (
                <svg viewBox="0 0 40 40" className="w-full h-full p-0.5 drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]">
                    <circle cx="20" cy="20" r="13" fill={color} stroke="white" strokeWidth="1" />
                    <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.2)" />
                </svg>
            );
        default:
            return <div className="w-full h-full bg-slate-700 rounded-full" />;
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

export default function TowerControls() {
    const state = useGameState();
    const selection = state.selection;
    const lang = state.language;

    const renderContent = () => {
        if (!selection) {
            return (
                <div className="text-slate-500 text-center mt-2 lg:mt-10 self-center lg:self-auto">
                    <p className="text-[10px] lg:text-sm">{t('ui.selectTile', lang) || 'Select a tile to build'}</p>
                    <p className="text-[9px] lg:text-xs opacity-50 mt-1">{t('ui.selectTower', lang) || 'or select a tower to upgrade'}</p>
                </div>
            );
        }

        // --- UPGRADE / SELL MODE ---
        if (selection.towerId) {
            const tower = state.towers.find(t => t.id === selection.towerId);
            if (!tower) return null;

            const data = TOWERS[tower.typeId];
            const currentTier = data.tiers[tower.tier - 1];
            const nextTier = tower.tier < 3 ? data.tiers[tower.tier as 1 | 2] : null;

            const handleUpgrade = () => gameManager.upgradeTower();
            const handleSell = () => gameManager.sellTower();

            const refund = Math.floor((
                data.tiers[0].stats.cost +
                (tower.tier >= 2 ? data.tiers[1].stats.cost : 0) +
                (tower.tier >= 3 ? data.tiers[2].stats.cost : 0)
            ) * 0.5);

            return (
                <div className="flex flex-col h-full animate-fade-in w-full">
                    <div className="mb-2 lg:mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg bg-slate-800 border border-white/10 shadow-inner flex items-center justify-center">
                                    <TowerIcon type={tower.typeId} color={getTowerColor(tower.typeId)} />
                                </div>
                                <h2 className="text-sm lg:text-2xl font-black text-white">{t(`tower.${tower.typeId}`, lang)}</h2>
                            </div>
                            <button onClick={() => gameManager.setSelection(null)} className="lg:hidden text-slate-500 p-1">✕</button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 lg:mt-2">
                            <span className="px-1.5 py-0.5 rounded text-[8px] lg:text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                L{tower.tier}
                            </span>
                            <p className="text-slate-300 text-[9px] lg:text-sm leading-tight lg:leading-relaxed line-clamp-1 lg:line-clamp-none">{t(`tower.desc.${tower.typeId}`, lang)}</p>
                        </div>
                    </div>

                    <div className="hidden lg:flex bg-white/5 rounded-xl p-4 mb-6 border border-white/5 flex-col space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Damage</span>
                            <span className="text-white font-mono">{currentTier.stats.damage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Rate</span>
                            <span className="text-white font-mono">{currentTier.stats.fireRate}/s</span>
                        </div>
                    </div>

                    <div className="mt-auto flex lg:flex-col gap-2">
                        {nextTier ? (
                            <button
                                onClick={handleUpgrade}
                                disabled={state.gold < nextTier.stats.cost}
                                className={`flex-1 py-1.5 lg:py-3 px-3 rounded-lg lg:rounded-xl font-bold transition-all flex items-center justify-between border
                                ${state.gold >= nextTier.stats.cost
                                        ? 'bg-indigo-600 border-indigo-400 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                            >
                                <span className="text-[10px] lg:text-base">{t('ui.upgrade', lang).toUpperCase()}</span>
                                <span className="text-[9px] lg:text-sm font-mono ml-2">-{nextTier.stats.cost}G</span>
                            </button>
                        ) : (
                            <div className="flex-1 py-1.5 lg:py-3 text-center bg-white/5 border border-white/5 rounded-lg text-slate-500 font-bold uppercase text-[9px] lg:text-xs">
                                Max
                            </div>
                        )}

                        <button
                            onClick={handleSell}
                            className="flex-1 py-1.5 lg:py-3 px-3 rounded-lg font-bold bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between"
                        >
                            <span className="text-[10px] lg:text-base">{t('ui.sell', lang).toUpperCase()}</span>
                            <span className="opacity-70 text-[9px] lg:text-sm ml-2">+{refund}G</span>
                        </button>
                    </div>
                </div>
            );
        }

        // --- BUILD MODE ---
        if (selection.tile && !selection.towerId) {
            return (
                <div className="flex flex-col h-full animate-fade-in w-full">
                    <div className="mb-2 lg:mb-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xs lg:text-xl font-black text-white uppercase tracking-wider">Deploy</h2>
                        </div>
                        <button onClick={() => gameManager.setSelection(null)} className="lg:hidden text-slate-500 p-1">✕</button>
                    </div>

                    <div className="flex-1 overflow-x-auto lg:overflow-y-auto flex lg:flex-col gap-2 pb-1 custom-scrollbar">
                        {(Object.values(TOWERS) as any[]).map((towerReq) => {
                            const initCost = towerReq.tiers[0].stats.cost;
                            const canAfford = state.gold >= initCost;
                            const isLocked = state.wave < (towerReq.unlockWave || 1);

                            if (isLocked) {
                                return (
                                    <div key={towerReq.id} className="min-w-[80px] lg:min-w-0 p-1.5 lg:p-3 rounded-lg lg:rounded-xl bg-black/20 border border-white/5 flex flex-col lg:flex-row items-center gap-1 lg:gap-4 opacity-40 grayscale">
                                        <div className="w-6 h-6 lg:w-12 lg:h-12 rounded-md bg-slate-900 flex items-center justify-center text-sm lg:text-2xl">?</div>
                                        <div className="text-[7px] lg:text-xs text-slate-600">W{towerReq.unlockWave}</div>
                                    </div>
                                );
                            }

                            return (
                                <button
                                    key={towerReq.id}
                                    onClick={() => gameManager.buildTower(towerReq.id)}
                                    disabled={!canAfford}
                                    className={`min-w-[120px] lg:min-w-0 text-left p-1.5 lg:p-3 rounded-lg lg:rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 flex-shrink-0
                                    ${canAfford
                                            ? 'bg-slate-800/80 lg:bg-slate-800/50 hover:bg-slate-700/50 border-white/10 shadow-lg'
                                            : 'bg-slate-950/80 border-white/5 opacity-50'}`}
                                >
                                    <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-md lg:rounded-lg flex items-center justify-center shadow-inner
                                        ${canAfford ? 'bg-slate-900 border border-white/10' : 'bg-slate-950'}`}>
                                        <TowerIcon type={towerReq.id} color={getTowerColor(towerReq.id)} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-center gap-1">
                                            <span className="font-bold text-slate-200 text-[9px] lg:text-sm truncate">{t(`tower.${towerReq.id}`, lang)}</span>
                                            <span className={`text-[8px] lg:text-xs font-mono font-bold ${canAfford ? 'text-yellow-400' : 'text-slate-600'}`}>{initCost}G</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
    };

    return (
        <aside className={`
            fixed z-20 flex flex-col shadow-2xl transition-all duration-300
            bg-[#0b1120]/95 backdrop-blur-lg border-white/10
            ${selection
                ? 'bottom-0 left-0 right-0 h-[140px] lg:h-auto lg:w-[240px] lg:top-0 lg:bottom-0 border-t lg:border-r lg:border-t-0 p-3 lg:p-5 translate-y-0'
                : 'lg:block lg:w-[240px] lg:top-0 lg:bottom-0 lg:left-0 border-r p-5 translate-y-full lg:translate-y-0 hidden h-0 lg:h-auto'
            }
        `}>
            {/* Desktop Header */}
            <div className="hidden lg:flex mb-6 items-center gap-2 opacity-50">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">System Command</div>
            </div>

            {renderContent()}
        </aside>
    );
}
