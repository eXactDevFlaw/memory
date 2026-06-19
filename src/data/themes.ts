import type { ThemeName, CardIcon } from '../types/index';

export interface ThemeConfig {
  name: string;
  bgColor: string;
  cardBackColor: string;
  textColor: string;
  accentColor: string;
  scoreBarBg: string;
  exitBtnBorder: string;
  gameoverBg: string;
  backIcon: string;
  icons: CardIcon[];
}

/** Returns the public-asset URL for an icon, respecting Vite's configured base path. */
function iconPath(folder: string, file: string): string {
  return `${import.meta.env.BASE_URL}icons/${folder}/${file}.svg`;
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
    backIcon: iconPath('code-vibes', 'back'),
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
    backIcon: iconPath('gaming', 'back'),
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
    backIcon: iconPath('da-projects', 'back'),
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
    backIcon: iconPath('food', 'back'),
    icons: buildImageIcons('food', Array.from({ length: 18 }, (_, i) => String(i + 1))),
  },
};

/** Returns the config for a given theme name. */
export function getTheme(name: ThemeName): ThemeConfig {
  return THEMES[name];
}

/** Returns a small themed card-grid HTML snippet for the settings preview. */
export function getThemePreviewHtml(name: ThemeName): string {
  const theme = THEMES[name];
  const previewIcons = theme.icons.slice(0, 4);

  const cardsHtml = previewIcons.map(icon => {
    let iconHtml: string;
    if (icon.type === 'badge') {
      iconHtml = `<span class="preview-card__badge" style="background:${icon.badgeBg};color:${icon.badgeColor}">${icon.value}</span>`;
    } else if (icon.type === 'image') {
      iconHtml = `<img class="preview-card__image" src="${icon.value}" alt="" />`;
    } else {
      iconHtml = `<span class="preview-card__emoji">${icon.value}</span>`;
    }
    return `<div class="preview-card" style="background:${theme.cardBackColor}">${iconHtml}</div>`;
  }).join('');

  return `<div class="theme-preview" style="background:${theme.bgColor}">${cardsHtml}</div>`;
}
