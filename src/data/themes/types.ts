import type { CardIcon, PlayerColor } from '../../types/index';

/** Per-theme colors and sizing for the in-game exit-confirmation modal. */
export interface ThemeModalConfig {
  boxBg: string;
  headingColor: string;
  backBg: string;
  backBorder: string;
  backText: string;
  backShadow: string;
  exitBg: string;
  exitBorder: string;
  exitText: string;
  exitShadow: string;
}

/**
 * Per-theme colors for the game-over screen's "Back to start" button.
 * `bg` is also reused for the live scorebar's score-entry box background (confirmed
 * identical to `bg` for `code-vibes` via Figma dev mode).
 * Only the `code-vibes` theme's values come from an exact Figma spec so far;
 * the other three themes currently use placeholders derived from their `accentColor`.
 */
export interface ThemeGameoverBackBtnConfig {
  bg: string;
  border: string;
  text: string;
}

/** A game theme's full visual configuration. */
export interface ThemeConfig {
  name: string;
  bgColor: string;
  cardBackColor: string;
  textColor: string;
  accentColor: string;
  scoreBarBg: string;
  exitBtnBorder: string;
  /** Border/glow color on hover. Confirmed via Figma for `code-vibes`; other themes use `accentColor` as a placeholder. */
  exitBtnHoverColor: string;
  gameoverBg: string;
  gameoverTextColor: string;
  titleFont: string;
  titleWeight: number;
  titleColor: string;
  titleUppercase: boolean;
  scoreLayout: 'labeled' | 'compact';
  scoreOrder: [PlayerColor, PlayerColor];
  scorePillBg: string;
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
