import { useEffect, useState } from 'react';
import { gameManager, GameManager } from '../GameManager';
import { GameState } from '../state/GameState';

export function useGameState(): GameState {
    const [state, setState] = useState<GameState>(gameManager.state);
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const onTick = (newState: GameState, tick: number) => {
            // Force React to re-render by creating a completely new state object
            // This ensures React detects the change even for nested properties
            setState({
                ...newState,
                gold: newState.gold,
                lives: newState.lives,
                wave: newState.wave,
                enemies: [...newState.enemies],
                towers: [...newState.towers],
            });
        };

        gameManager.subscribe(onTick);
        return () => gameManager.unsubscribe();
    }, []);

    return state;
}
