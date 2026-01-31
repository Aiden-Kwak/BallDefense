import { useEffect, useReducer } from 'react';
import { gameManager } from '../GameManager';
import { GameState } from '../state/GameState';

// Use reducer to force re-renders
function stateReducer(state: GameState, newState: GameState): GameState {
    // Create a completely new object with new primitive values
    // This ensures React detects changes to gold and lives
    return {
        ...newState,
        gold: Number(newState.gold), // Force new primitive value
        lives: Number(newState.lives), // Force new primitive value
        wave: Number(newState.wave),
        enemies: [...newState.enemies],
        towers: [...newState.towers],
        projectiles: [...newState.projectiles],
    };
}

export function useGameState(): GameState {
    const [state, dispatch] = useReducer(stateReducer, gameManager.state);

    useEffect(() => {
        const onTick = (newState: GameState, tick: number) => {
            // Log to verify callback is being called
            if (tick % 60 === 0) {
                console.log('[useGameState] Gold:', newState.gold, 'Lives:', newState.lives, 'Tick:', tick);
            }
            // Dispatch new state to force re-render
            dispatch(newState);
        };

        console.log('[useGameState] Subscribing to game state updates');
        gameManager.subscribe(onTick);

        return () => {
            console.log('[useGameState] Unsubscribing from game state updates');
            gameManager.unsubscribe();
        };
    }, []);

    return state;
}
