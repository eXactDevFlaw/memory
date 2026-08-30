/** The four selectable visual themes for the game board. */
export type ThemeName = 'code-vibes' | 'gaming' | 'da-projects' | 'food';

/** The two players a card can belong to. */
export type PlayerColor = 'blue' | 'orange';

/** The number of cards a board can be set up with. */
export type BoardSize = 16 | 24 | 36;

/** The top-level screen currently shown by the app. */
export type GameScreen = 'home' | 'settings' | 'game' | 'gameover';

/** A single card face's visual content. */
export interface CardIcon {
  type: 'emoji' | 'badge' | 'image';
  value: string;
  badgeBg?: string;
  badgeColor?: string;
}

/** A single memory card and its current flip/match state. */
export interface Card {
  id: number;
  pairId: number;
  icon: CardIcon;
  isFlipped: boolean;
  isMatched: boolean;
}

/** The player-configurable options chosen on the settings screen. `null` means not yet picked. */
export interface GameSettings {
  theme: ThemeName | null;
  player: PlayerColor | null;
  boardSize: BoardSize | null;
}

/** The full application state for one game session. */
export interface GameState {
  screen: GameScreen;
  settings: GameSettings;
  currentPlayer: PlayerColor;
  scores: Record<PlayerColor, number>;
  cards: Card[];
  flippedIndexes: number[];
  isLocked: boolean;
}
