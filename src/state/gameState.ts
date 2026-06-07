import type { GameState, GameSettings } from '../types/index';

const defaultSettings: GameSettings = {
  theme: 'code-vibes',
  player: 'blue',
  boardSize: 16,
};

let state: GameState = {
  screen: 'home',
  settings: { ...defaultSettings },
  currentPlayer: 'blue',
  scores: { blue: 0, orange: 0 },
  cards: [],
  flippedIndexes: [],
  isLocked: false,
};

export function getState(): GameState {
  return state;
}

export function setState(partial: Partial<GameState>): void {
  state = { ...state, ...partial };
}

export function resetToHome(): void {
  state = {
    screen: 'home',
    settings: { ...defaultSettings },
    currentPlayer: 'blue',
    scores: { blue: 0, orange: 0 },
    cards: [],
    flippedIndexes: [],
    isLocked: false,
  };
}
