import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { gameManager } from '../GameManager';
import { TOWERS } from '../data/towers';

export default function TowerControls() {
    const state = useGameState();
    const selection = state.selection;

    if (!selection) return null;

    // Render Upgrade Logic
    if (selection.towerId) {
        const tower = state.towers.find(t => t.id === selection.towerId);
        if (!tower) return null;

        const data = TOWERS[tower.typeId];
        const currentTier = data.tiers[tower.tier - 1];
        const nextTier = tower.tier < 3 ? data.tiers[tower.tier as 1 | 2] : null;

        const handleUpgrade = () => gameManager.upgradeTower();
        const handleSell = () => gameManager.sellTower();

        return (
            <div className="absolute bottom-6 left-4 right-4 z-20 animate-slide-up">
                <div className="bg-black/80 backdrop-blur-xl border border-white/15 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-white tracking-tight">{data.name}</h2>
                                <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-amber-300">
                                    LVL {tower.tier}
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm mt-1 font-medium">{currentTier.description}</p>
                        </div>

                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DPS Output</div>
                            <div className="text-xl font-black text-cyan-300">{Math.round(currentTier.stats.damage * currentTier.stats.fireRate)}</div>
                        </div>
                    </div>

                    <div className="flex gap-3 relative z-10">
                        {nextTier ? (
                            <button
                                onClick={handleUpgrade}
                                disabled={state.gold < nextTier.stats.cost}
                                className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex flex-col items-center justify-center gap-1 group relative overflow-hidden
                                ${state.gold >= nextTier.stats.cost
                                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 border border-white/20'
                                        : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'}`}
                            >
                                <span className="relative z-10 flex items-center gap-1">
                                    UPGRADE
                                    <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                </span>
                                <span className={`text-xs font-mono relative z-10 ${state.gold >= nextTier.stats.cost ? 'text-indigo-200' : 'text-slate-600'}`}>
                                    -{nextTier.stats.cost} G
                                </span>
                                {state.gold >= nextTier.stats.cost && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                            </button>
                        ) : (
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 font-bold tracking-widest">
                                MAX LEVEL
                            </div>
                        )}

                        <button
                            onClick={handleSell}
                            className="w-24 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-bold rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center"
                        >
                            <span>SELL</span>
                            <span className="text-xs opacity-60">+{(currentTier.stats.cost * 0.7).toFixed(0)}</span>
                        </button>
                    </div>

                    <button
                        onClick={() => { gameManager.state.selection = null; }}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
        );
    }

    // Render Build Logic
    return (
        <div className="absolute bottom-6 left-4 right-4 z-20 animate-slide-up">
            <div className="bg-black/90 backdrop-blur-xl border border-white/15 p-5 rounded-3xl shadow-2xl">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Deploy Unit
                    </h3>
                    <button
                        onClick={() => { gameManager.state.selection = null; }}
                        className="text-slate-500 hover:text-white"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto pr-1">
                    {(Object.values(TOWERS) as any[]).map((towerReq) => {
                        const initCost = towerReq.tiers[0].stats.cost;
                        const canAfford = state.gold >= initCost;
                        const damageType = towerReq.tiers[0].stats.type;

                        return (
                            <button
                                key={towerReq.id}
                                onClick={() => gameManager.buildTower(towerReq.id)}
                                disabled={!canAfford}
                                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 relative overflow-hidden group
                                 ${canAfford
                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white'
                                        : 'bg-black/20 border-white/5 text-slate-600 opacity-50'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg mb-1 relative
                                 ${canAfford ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 group-hover:scale-110 transition-transform' : 'bg-slate-900'}`}>
                                    <span className={damageType === 'MAGIC' ? 'text-purple-400' : 'text-blue-400'}>{towerReq.name[0]}</span>

                                    {/* Type Indicator Dot */}
                                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${damageType === 'MAGIC' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] font-bold uppercase tracking-tight leading-none text-slate-300">{towerReq.name}</div>
                                    <div className={`text-xs font-mono font-bold mt-1 ${canAfford ? 'text-yellow-400' : 'text-slate-600'}`}>{initCost} <span className="text-[9px] opacity-70">G</span></div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
