import type { GameState, GameSettings } from '../types/index';

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'code-vibes',
  player: 'blue',
  boardSize: 16,
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

/** Returns the current game state. */
export function getState(): GameState {
  return state;
}

/** Merges a partial update into the current game state. */
export function setState(partial: Partial<GameState>): void {
  state = { ...state, ...partial };
}

/** Resets the entire state back to the initial home screen. */
export function resetToHome(): void {
  state = {
    screen: 'home',
    settings: { ...DEFAULT_SETTINGS },
    currentPlayer: 'blue',
    scores: { blue: 0, orange: 0 },
    cards: [],
    flippedIndexes: [],
    isLocked: false,
  };
}
