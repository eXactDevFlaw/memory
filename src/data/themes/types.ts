import type { CardIcon } from '../../types/index';

/** Per-theme colors, labels and motion for the in-game exit-confirmation modal. */
export interface ThemeModalConfig {
  boxBg: string;
  headingColor: string;
  backLabel: string;
  backBg: string;
  backBorder: string;
  backText: string;
  backShadow: string;
  exitLabel: string;
  exitBg: string;
  exitBorder: string;
  exitText: string;
  exitShadow: string;
  /** Edge the dialog box slides in from when opened, or `fade` to only fade it in (Figma "Dissolve"). */
  enterFrom: 'top' | 'bottom' | 'fade';
  /** Whether "back to game" animates the dialog out (true) or closes it instantly (false). */
  animateClose: boolean;
}

/**
 * Per-theme label and colors for the game-over screen's back button.
 * `code-vibes` and `gaming` come from Figma; the other themes use placeholders derived from their `accentColor`.
 */
export interface ThemeGameoverBackBtnConfig {
  label: string;
  bg: string;
  border: string;
  text: string;
}

/** Per-theme colors for the scorebar's "Exit game" button. */
export interface ThemeExitBtnConfig {
  bg: string;
  border: string;
  /** Text and icon color; falls back to the theme's `textColor`. */
  text?: string;
}

/**
 * Colors for the game-over result reveal (winner / draw), for themes where it
 * differs from the "Game over" title screen. Each falls back to `gameoverBg` / `gameoverTextColor`.
 */
export interface ThemeResultConfig {
  bg: string;
  labelColor: string;
  drawLabelColor: string;
}

/**
 * Per-theme look of the blue/orange score box on the game and game-over screens.
 * `labeled` shows tag + "Blue 3"; `compact` shows pawn + "3" with orange first.
 */
export interface ThemeScoreBoxConfig {
  layout: 'labeled' | 'compact';
  bg: string;
}

/** A game theme's full visual configuration. */
export interface ThemeConfig {
  name: string;
  bgColor: string;
  cardBackColor: string;
  textColor: string;
  accentColor: string;
  scoreBarBg: string;
  /** Border/glow color on hover for the exit and game-over back buttons. Confirmed via Figma for `code-vibes`; other themes use `accentColor` as a placeholder. */
  exitBtnHoverColor: string;
  exitBtn: ThemeExitBtnConfig;
  scoreBox: ThemeScoreBoxConfig;
  gameoverBg: string;
  gameoverTextColor: string;
  titleFont: string;
  titleWeight: number;
  titleColor: string;
  titleUppercase: boolean;
  /** Whether the winner reveal shows the confetti banner. */
  winnerConfetti: boolean;
  /** Image shown under the winner's name; falls back to a pawn in the winner's color. */
  winnerImage?: string;
  /** Color of the winner's name; falls back to the winner's player color. */
  winnerNameColor?: string;
  result?: ThemeResultConfig;
  backIcon: string;
  previewImage: string;
  icons: CardIcon[];
  modal: ThemeModalConfig;
  gameoverBackBtn: ThemeGameoverBackBtnConfig;
}

/**
 * Returns the public-asset URL for an icon, respecting Vite's configured base path.
 * @param folder - The theme's icon subfolder name.
 * @param file - The icon file's base name, without extension.
 * @returns The icon's public URL.
 */
export function iconPath(folder: string, file: string): string {
  return `${import.meta.env.BASE_URL}icons/${folder}/${file}.svg`;
}

/**
 * Returns the public-asset URL for a shared, theme-agnostic UI asset.
 * @param file - The asset file's base name, without extension.
 * @returns The asset's public URL.
 */
export function uiPath(file: string): string {
  return `${import.meta.env.BASE_URL}ui/${file}.svg`;
}

const ICONS_PER_THEME = 18;

/**
 * Builds the image-based card icons for a theme from a folder of numbered files.
 * @param folder - The theme's icon subfolder name.
 * @returns The theme's full pool of card icons.
 */
export function buildImageIcons(folder: string): CardIcon[] {
  const files = Array.from({ length: ICONS_PER_THEME }, (_, i) => String(i + 1));
  return files.map(file => ({ type: 'image', value: iconPath(folder, file) }));
}
