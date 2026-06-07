export type ThemeName = 'code-vibes' | 'gaming' | 'da-projects' | 'food';
export type PlayerColor = 'blue' | 'orange';
export type BoardSize = 16 | 24 | 36;
export type GameScreen = 'home' | 'settings' | 'game' | 'gameover';

export interface CardIcon {
  type: 'emoji' | 'badge';
  value: string;
  badgeBg?: string;
  badgeColor?: string;
}

export interface Card {
  id: number;
  pairId: number;
  icon: CardIcon;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameSettings {
  theme: ThemeName;
  player: PlayerColor;
  boardSize: BoardSize;
}

export interface GameState {
  screen: GameScreen;
  settings: GameSettings;
  currentPlayer: PlayerColor;
  scores: Record<PlayerColor, number>;
  cards: Card[];
  flippedIndexes: number[];
  isLocked: boolean;
}
