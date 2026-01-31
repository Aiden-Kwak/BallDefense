import { useEffect, useState } from 'react';
import { gameManager, GameManager } from '../GameManager';
import { GameState } from '../state/GameState';

export function useGameState(): GameState {
    const [state, setState] = useState<GameState>(gameManager.state);
    const [updateCount, setUpdateCount] = useState(0);

    useEffect(() => {
        const onTick = (newState: GameState, tick: number) => {
            // Force React to re-render by incrementing counter
            // This ensures UI updates immediately when gold/lives change
            setUpdateCount(prev => prev + 1);
            setState(newState);
        };

        gameManager.subscribe(onTick);
        return () => gameManager.unsubscribe();
    }, []);

    // Return a new object reference each time to ensure React detects changes
    return {
        ...state,
        // Explicitly include gold and lives to ensure they trigger re-renders
        gold: state.gold,
        lives: state.lives,
    };
}
