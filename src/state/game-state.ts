import type { GameState, GameSettings } from '../types/index';

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'code-vibes',
  player: null,
  boardSize: null,
};

let state: GameState = {
  screen: 'home',
  settings: { ...DEFAULT_SETTINGS },
  currentPlayer: 'blue',
  scores: { blue: 0, orange: 0 },
  cards: [],
  flippedIndexes: [],
  isLocked: false,
};

/**
 * Returns the current game state.
 * @returns The full state object for the active session.
 */
export function getState(): GameState {
  return state;
}

/**
 * Merges a partial update into the current game state.
 * @param partial - The fields to overwrite on the current state.
 */
export function setState(partial: Partial<GameState>): void {
  state = { ...state, ...partial };
}
