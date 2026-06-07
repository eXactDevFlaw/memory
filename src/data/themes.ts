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
  icons: CardIcon[];
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
    icons: [
      { type: 'badge', value: 'Git',  badgeBg: '#F05032', badgeColor: '#fff' },
      { type: 'badge', value: 'TS',   badgeBg: '#3178C6', badgeColor: '#fff' },
      { type: 'badge', value: 'JS',   badgeBg: '#F7DF1E', badgeColor: '#000' },
      { type: 'badge', value: 'HTML', badgeBg: '#E34F26', badgeColor: '#fff' },
      { type: 'badge', value: 'CSS',  badgeBg: '#1572B6', badgeColor: '#fff' },
      { type: 'badge', value: 'Py',   badgeBg: '#3776AB', badgeColor: '#fff' },
      { type: 'badge', value: 'Vue',  badgeBg: '#4FC08D', badgeColor: '#fff' },
      { type: 'badge', value: '⚛',   badgeBg: '#61DAFB', badgeColor: '#000' },
      { type: 'badge', value: 'Node', badgeBg: '#339933', badgeColor: '#fff' },
      { type: 'badge', value: 'Sass', badgeBg: '#CC6699', badgeColor: '#fff' },
      { type: 'badge', value: '🔥',   badgeBg: '#FFA000', badgeColor: '#fff' },
      { type: 'badge', value: 'ng',   badgeBg: '#DD0031', badgeColor: '#fff' },
      { type: 'badge', value: '>_',   badgeBg: '#1E1E1E', badgeColor: '#0f0' },
      { type: 'badge', value: 'GH',   badgeBg: '#24292E', badgeColor: '#fff' },
      { type: 'badge', value: 'BS',   badgeBg: '#7952B3', badgeColor: '#fff' },
      { type: 'badge', value: 'Dj',   badgeBg: '#0C4B33', badgeColor: '#fff' },
      { type: 'badge', value: '🐳',   badgeBg: '#2496ED', badgeColor: '#fff' },
      { type: 'badge', value: 'K8s',  badgeBg: '#326CE5', badgeColor: '#fff' },
    ],
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
    icons: [
      { type: 'emoji', value: '👾' },
      { type: 'emoji', value: '🎮' },
      { type: 'emoji', value: '🕹️' },
      { type: 'emoji', value: '🎯' },
      { type: 'emoji', value: '🏆' },
      { type: 'emoji', value: '🎲' },
      { type: 'emoji', value: '👑' },
      { type: 'emoji', value: '⚔️' },
      { type: 'emoji', value: '🛡️' },
      { type: 'emoji', value: '🧩' },
      { type: 'emoji', value: '💎' },
      { type: 'emoji', value: '🔮' },
      { type: 'emoji', value: '🌟' },
      { type: 'emoji', value: '🃏' },
      { type: 'emoji', value: '🎠' },
      { type: 'emoji', value: '🎪' },
      { type: 'emoji', value: '🗡️' },
      { type: 'emoji', value: '💣' },
    ],
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
    icons: [
      { type: 'emoji', value: '🍜' },
      { type: 'emoji', value: '🔥' },
      { type: 'emoji', value: '🌸' },
      { type: 'emoji', value: '☁️' },
      { type: 'emoji', value: '🧁' },
      { type: 'emoji', value: '🎯' },
      { type: 'emoji', value: '🌐' },
      { type: 'emoji', value: '😊' },
      { type: 'emoji', value: '▶️' },
      { type: 'emoji', value: '📊' },
      { type: 'emoji', value: '🌿' },
      { type: 'emoji', value: '📱' },
      { type: 'emoji', value: '🥦' },
      { type: 'emoji', value: '👤' },
      { type: 'emoji', value: '📄' },
      { type: 'emoji', value: '⭐' },
      { type: 'emoji', value: '🚀' },
      { type: 'emoji', value: '🔬' },
    ],
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
    icons: [
      { type: 'emoji', value: '🍟' },
      { type: 'emoji', value: '🌮' },
      { type: 'emoji', value: '🌭' },
      { type: 'emoji', value: '🍣' },
      { type: 'emoji', value: '🍔' },
      { type: 'emoji', value: '🍕' },
      { type: 'emoji', value: '🍦' },
      { type: 'emoji', value: '🧁' },
      { type: 'emoji', value: '🍩' },
      { type: 'emoji', value: '🍫' },
      { type: 'emoji', value: '🍰' },
      { type: 'emoji', value: '🍪' },
      { type: 'emoji', value: '🍎' },
      { type: 'emoji', value: '🍓' },
      { type: 'emoji', value: '🥑' },
      { type: 'emoji', value: '🍋' },
      { type: 'emoji', value: '🍇' },
      { type: 'emoji', value: '🫐' },
    ],
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
    const iconHtml = icon.type === 'badge'
      ? `<span class="preview-card__badge" style="background:${icon.badgeBg};color:${icon.badgeColor}">${icon.value}</span>`
      : `<span class="preview-card__emoji">${icon.value}</span>`;
    return `<div class="preview-card" style="background:${theme.cardBackColor}">${iconHtml}</div>`;
  }).join('');

  return `<div class="theme-preview" style="background:${theme.bgColor}">${cardsHtml}</div>`;
}
