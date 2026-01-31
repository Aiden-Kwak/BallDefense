import { useEffect, useReducer } from 'react';
import { gameManager } from '../GameManager';
import { GameState } from '../state/GameState';

// Use reducer to force re-renders
function stateReducer(state: GameState, newState: GameState): GameState {
    // Always return a new object to trigger React re-render
    return { ...newState };
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
