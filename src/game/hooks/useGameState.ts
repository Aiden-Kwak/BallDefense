import { useEffect, useState } from 'react';
import { gameManager, GameManager } from '../GameManager';
import { GameState } from '../state/GameState';

export function useGameState(): GameState {
    const [state, setState] = useState<GameState>(gameManager.state);

    useEffect(() => {
        const onTick = (newState: GameState) => {
            // Force update
            setState({ ...newState });
            // Note: Shallow copy needed to trigger React render if properties mutated deep.
            // Since 'newState' is the SAME object reference, React might bail out if we just set new pointer?
            // No, spread creates new object reference. Deep props like 'enemies' are same ref.
            // This is MVP optimization.
        };

        gameManager.subscribe(onTick);
        return () => gameManager.unsubscribe();
    }, []);

    return state;
}
