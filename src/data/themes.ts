import type { ThemeName, CardIcon, PlayerColor } from '../types/index';

export interface ThemeConfig {
  name: string;
  bgColor: string;
  cardBackColor: string;
  textColor: string;
  accentColor: string;
  scoreBarBg: string;
  exitBtnBorder: string;
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
}

/** Returns the public-asset URL for an icon, respecting Vite's configured base path. */
function iconPath(folder: string, file: string): string {
  return `${import.meta.env.BASE_URL}icons/${folder}/${file}.svg`;
}

/** Returns the public-asset URL for a shared, theme-agnostic UI asset. */
function uiPath(file: string): string {
  return `${import.meta.env.BASE_URL}ui/${file}.svg`;
}

/** Builds the 18 image-based card icons for a theme from a folder + filename list. */
function buildImageIcons(folder: string, files: string[]): CardIcon[] {
  return files.map(file => ({ type: 'image', value: iconPath(folder, file) }));
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  'code-vibes': {
    name: 'Code Vibes',
    bgColor: '#2A2D30',
    cardBackColor: '#45B7AC',
    textColor: '#ffffff',
    accentColor: '#45B7AC',
    scoreBarBg: '#2A2D30',
    exitBtnBorder: 'rgba(255,255,255,0.3)',
    gameoverBg: '#2A2D30',
    gameoverTextColor: '#ffffff',
    titleFont: "'Red Rose', var(--font-headline)",
    titleWeight: 700,
    titleColor: '#45B7AC',
    titleUppercase: false,
    scoreLayout: 'labeled',
    scoreOrder: ['blue', 'orange'],
    scorePillBg: 'rgba(255,255,255,0.08)',
    backIcon: iconPath('code-vibes', 'back'),
    previewImage: uiPath('preview-code-vibes'),
    icons: buildImageIcons('code-vibes', Array.from({ length: 18 }, (_, i) => String(i + 1))),
  },
  'gaming': {
    name: 'Gaming',
    bgColor: '#1B2744',
    cardBackColor: '#C2185B',
    textColor: '#ffffff',
    accentColor: '#E91E8C',
    scoreBarBg: '#141e36',
    exitBtnBorder: 'rgba(255,255,255,0.3)',
    gameoverBg: '#1B2744',
    gameoverTextColor: '#ffffff',
    titleFont: "'Orbitron', var(--font-headline)",
    titleWeight: 800,
    titleColor: '#E91E8C',
    titleUppercase: true,
    scoreLayout: 'compact',
    scoreOrder: ['orange', 'blue'],
    scorePillBg: '#ffffff',
    backIcon: iconPath('gaming', 'back'),
    previewImage: uiPath('preview-gaming'),
    icons: buildImageIcons('gaming', Array.from({ length: 18 }, (_, i) => String(i + 1))),
  },
  'da-projects': {
    name: 'DA Projects',
    bgColor: '#1B3A5C',
    cardBackColor: '#2B7FBF',
    textColor: '#ffffff',
    accentColor: '#4FC3F7',
    scoreBarBg: '#142d48',
    exitBtnBorder: 'rgba(255,255,255,0.3)',
    gameoverBg: '#1B3A5C',
    gameoverTextColor: '#ffffff',
    titleFont: "'Figtree', var(--font-headline)",
    titleWeight: 800,
    titleColor: '#1E7594',
    titleUppercase: true,
    scoreLayout: 'compact',
    scoreOrder: ['orange', 'blue'],
    scorePillBg: '#ffffff',
    backIcon: iconPath('da-projects', 'back'),
    previewImage: uiPath('preview-da-projects'),
    icons: buildImageIcons('da-projects', Array.from({ length: 18 }, (_, i) => String(i + 1))),
  },
  'food': {
    name: 'Foods',
    bgColor: '#F5F0E8',
    cardBackColor: '#F5921B',
    textColor: '#2D2D2D',
    accentColor: '#F5921B',
    scoreBarBg: '#ede8e0',
    exitBtnBorder: 'rgba(0,0,0,0.2)',
    gameoverBg: '#F5921B',
    gameoverTextColor: '#ffffff',
    titleFont: "'Klee One', var(--font-headline)",
    titleWeight: 600,
    titleColor: '#ffffff',
    titleUppercase: true,
    scoreLayout: 'compact',
    scoreOrder: ['orange', 'blue'],
    scorePillBg: '#ffffff',
    backIcon: iconPath('food', 'back'),
    previewImage: uiPath('preview-foods'),
    icons: buildImageIcons('food', Array.from({ length: 18 }, (_, i) => String(i + 1))),
  },
};

/** Returns the config for a given theme name. */
export function getTheme(name: ThemeName): ThemeConfig {
  return THEMES[name];
}

/** Returns the themed preview illustration for the settings screen. */
export function getThemePreviewHtml(name: ThemeName): string {
  const theme = THEMES[name];
  return `<img class="settings__preview-img" src="${theme.previewImage}" alt="${theme.name} preview" />`;
}
