import type { ThemeName, CardIcon, PlayerColor } from '../types/index';

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

export interface ThemeGameoverBackBtnConfig {
  bg: string;
  border: string;
  text: string;
}

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
  modal: ThemeModalConfig;
  gameoverBackBtn: ThemeGameoverBackBtnConfig;
}

/** Returns the public-asset URL for an icon, respecting Vite's configured base path. */
function iconPath(folder: string, file: string): string {
  return `${import.meta.env.BASE_URL}icons/${folder}/${file}.svg`;
}

/** Returns the public-asset URL for a shared, theme-agnostic UI asset. */
function uiPath(file: string): string {
  return `${import.meta.env.BASE_URL}ui/${file}.svg`;
}

const ICONS_PER_THEME = 18;

/** Builds the image-based card icons for a theme from a folder of numbered files. */
function buildImageIcons(folder: string): CardIcon[] {
  const files = Array.from({ length: ICONS_PER_THEME }, (_, i) => String(i + 1));
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
    icons: buildImageIcons('code-vibes'),
    modal: {
      boxBg: '#FFFFFF',
      headingColor: '#303131',
      backBg: '#66CFBC',
      backBorder: 'none',
      backText: '#FFFFFF',
      backShadow: 'none',
      exitBg: '#86E9D624',
      exitBorder: '2px solid #4DD5BC',
      exitText: '#4DD5BC',
      exitShadow: 'none',
    },
    gameoverBackBtn: {
      bg: '#86E9D633',
      border: '1px solid #4DD5BC',
      text: '#FFFFFF',
    },
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
    icons: buildImageIcons('gaming'),
    modal: {
      boxBg: '#F0F6F9',
      headingColor: '#294F60',
      backBg: '#ED1B76',
      backBorder: '1px solid #E71C4F',
      backText: '#FFFFFF',
      backShadow: 'none',
      exitBg: '#ED1B7614',
      exitBorder: '1px solid #E71C4F',
      exitText: '#ED1B76',
      exitShadow: 'none',
    },
    // TODO: placeholder pending exact Figma values for this theme's "Back to start" button.
    gameoverBackBtn: {
      bg: '#E91E8C33',
      border: '1px solid #E91E8C',
      text: '#FFFFFF',
    },
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
    icons: buildImageIcons('da-projects'),
    modal: {
      boxBg: '#F0F6F9',
      headingColor: '#294F60',
      backBg: '#BFE5F2',
      backBorder: 'none',
      backText: '#1E7594',
      backShadow: '3px 3px 5px 0px #2F2E2E33',
      exitBg: '#FD8A81',
      exitBorder: 'none',
      exitText: '#FFFFFF',
      exitShadow: '3px 3px 5px 0px #2F2E2E33',
    },
    // TODO: placeholder pending exact Figma values for this theme's "Back to start" button.
    gameoverBackBtn: {
      bg: '#4FC3F733',
      border: '1px solid #4FC3F7',
      text: '#FFFFFF',
    },
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
    icons: buildImageIcons('food'),
    modal: {
      boxBg: '#F6F6F6',
      headingColor: '#A45212',
      backBg: '#FFAB3E',
      backBorder: '3px solid #F3832D',
      backText: '#FFFFFF',
      backShadow: 'none',
      exitBg: '#FFF9F2',
      exitBorder: '3px solid #F3832D',
      exitText: '#F3832D',
      exitShadow: 'none',
    },
    // TODO: placeholder pending exact Figma values for this theme's "Back to start" button.
    gameoverBackBtn: {
      bg: '#F3832D33',
      border: '1px solid #F3832D',
      text: '#FFFFFF',
    },
  },
};

/** Returns the config for a given theme name. */
export function getTheme(name: ThemeName): ThemeConfig {
  return THEMES[name];
}

/** Returns the themed preview illustration for the settings screen. */
export function getThemePreviewHtml(name: ThemeName): string {
  const theme = THEMES[name];
  return `
    <figure class="settings__preview-figure">
      <img class="settings__preview-img" src="${theme.previewImage}" alt="${theme.name} preview" />
      <figcaption class="settings__preview-caption">${theme.name}</figcaption>
    </figure>
  `;
}
