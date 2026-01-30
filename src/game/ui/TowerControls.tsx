import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { gameManager } from '../GameManager';
import { TOWERS } from '../data/towers';

export default function TowerControls() {
    const state = useGameState();
    const selection = state.selection;

    // Always visible sidebar? Or only on selection?
    // User said "Tower shop... left side... not cover map".
    // If I make it always visible, it's a persistent sidebar.
    // But selection might be null.
    // If selection is null, we can show "Select a tile" or just empty.
    // Let's make it a persistent sidebar that changes content.

    const renderContent = () => {
        if (!selection) {
            return (
                <div className="text-slate-500 text-center mt-10">
                    <p className="text-sm">Select a tile to build</p>
                    <p className="text-xs opacity-50 mt-2">or select a tower to upgrade</p>
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

            return (
                <div className="flex flex-col h-full animate-fade-in">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-white">{data.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                LVL {tower.tier}
                            </span>
                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">{currentTier.stats.type}</span>
                        </div>
                        <p className="text-slate-300 text-sm mt-4 leading-relaxed">{currentTier.description}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Damage</span>
                            <span className="text-white font-mono">{currentTier.stats.damage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Rate</span>
                            <span className="text-white font-mono">{currentTier.stats.fireRate}/s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Range</span>
                            <span className="text-white font-mono">{currentTier.stats.range}</span>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        {nextTier ? (
                            <button
                                onClick={handleUpgrade}
                                disabled={state.gold < nextTier.stats.cost}
                                className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-between border group relative
                                ${state.gold >= nextTier.stats.cost
                                        ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                                        : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'}`}
                            >
                                <span>UPGRADE</span>
                                <div className="text-right flex flex-col items-end">
                                    <span className={state.gold >= nextTier.stats.cost ? 'text-indigo-200' : ''}>-{nextTier.stats.cost}G</span>
                                    {/* Tooltip / Diff - Just showing improved stats inline as mini-text */}
                                    <div className="absolute top-full left-0 right-0 bg-indigo-900/90 backdrop-blur p-2 hidden group-hover:flex justify-around text-[10px] text-white pointer-events-none border-t border-white/10 z-20">
                                        {nextTier.stats.damage > currentTier.stats.damage && <span>DMG: <span className="text-green-400">+{Math.round(nextTier.stats.damage - currentTier.stats.damage)}</span></span>}
                                        {nextTier.stats.fireRate > currentTier.stats.fireRate && <span>SPD: <span className="text-green-400">+{Math.round((nextTier.stats.fireRate - currentTier.stats.fireRate) * 100) / 100}</span></span>}
                                        {nextTier.stats.range > currentTier.stats.range && <span>RNG: <span className="text-green-400">+{Math.round((nextTier.stats.range - currentTier.stats.range) * 10) / 10}</span></span>}
                                    </div>
                                </div>
                            </button>
                        ) : (
                            <div className="w-full py-3 text-center bg-white/5 border border-white/5 rounded-xl text-slate-500 font-bold uppercase tracking-widest text-xs">
                                Max Level
                            </div>
                        )}

                        <button
                            onClick={handleSell}
                            className="w-full py-3 px-4 rounded-xl font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors flex items-center justify-between"
                        >
                            <span>SELL</span>
                            <span className="opacity-70">+{Math.floor(currentTier.stats.cost * 0.7)}G</span>
                        </button>
                    </div>
                </div>
            );
        }

        // --- BUILD MODE ---
        if (selection.tile && !selection.towerId) {
            return (
                <div className="flex flex-col h-full animate-fade-in">
                    <div className="mb-4">
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Construction</h2>
                        <p className="text-slate-400 text-xs mt-1">Select a unit to deploy.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {(Object.values(TOWERS) as any[]).map((towerReq) => {
                            const initCost = towerReq.tiers[0].stats.cost;
                            const canAfford = state.gold >= initCost;
                            const isLocked = state.wave < (towerReq.unlockWave || 1);

                            if (isLocked) {
                                return (
                                    <div key={towerReq.id} className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center gap-4 opacity-50 grayscale select-none">
                                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                                            <span className="text-2xl opacity-20">?</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-500">Locked</div>
                                            <div className="text-xs text-slate-600">Unlocks at Wave {towerReq.unlockWave}</div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <button
                                    key={towerReq.id}
                                    onClick={() => gameManager.buildTower(towerReq.id)}
                                    disabled={!canAfford}
                                    onMouseEnter={() => gameManager.setPreview(towerReq.id)}
                                    onMouseLeave={() => gameManager.setPreview(null)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all active:scale-95 group relative overflow-hidden
                                    ${canAfford
                                            ? 'bg-slate-800/50 hover:bg-slate-700/50 border-white/10 hover:border-white/30'
                                            : 'bg-slate-900/50 border-white/5 opacity-60'}`}
                                >
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-black shadow-lg
                                            ${canAfford ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10' : 'bg-slate-950'}`}>
                                            <span className={{ 'MAGIC': 'text-purple-400', 'PHYSICAL': 'text-blue-400' }[towerReq.tiers[0].stats.type as string] || 'text-white'}>
                                                {towerReq.name[0]}
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-200 text-sm">{towerReq.name}</span>
                                                <span className={`text-xs font-mono font-bold ${canAfford ? 'text-yellow-400' : 'text-slate-600'}`}>{initCost}G</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{towerReq.tiers[0].description}</div>
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
        <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#0b1120] border-r border-white/10 p-5 z-20 flex flex-col shadow-2xl">
            {/* Header / Logo Area */}
            <div className="mb-6 flex items-center gap-2 opacity-50">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">System Command</div>
            </div>

            {renderContent()}
        </aside>
    );
}
