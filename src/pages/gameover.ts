import { getState, setState } from '../state/game-state';
import { getTheme, type ThemeConfig } from '../data/themes';
import { render } from '../main';
import { renderScoresBox } from '../components/score-box';
import type { PlayerColor, ThemeName } from '../types/index';

/** The outcome of a finished game. */
type EndResult = 'blue-wins' | 'orange-wins' | 'draw';

const CONFETTI_PATH = `${import.meta.env.BASE_URL}ui/Confetti.svg`;
const PAWN_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-player.svg`;
const SCALE_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-scale.svg`;

/**
 * Determines the end result based on the final scores.
 * @returns Which player won, or that the game ended in a draw.
 */
function getResult(): EndResult {
  const { scores } = getState();
  if (scores.blue > scores.orange) return 'blue-wins';
  if (scores.orange > scores.blue) return 'orange-wins';
  return 'draw';
}

/**
 * Returns the CSS custom-property color for a player.
 * @param player - The player to get the color for.
 * @returns A `var(--color-*)` CSS color reference.
 */
function playerCssColor(player: PlayerColor): string {
  return player === 'blue' ? 'var(--color-blue)' : 'var(--color-orange)';
}

/**
 * Returns a mask-colored icon span for an arbitrary SVG asset, wrapped in a frame
 * so themes can add filter effects (e.g. an outline) that the mask would otherwise clip.
 * @param src - The URL of the SVG used as the mask image.
 * @param color - The icon's fill color.
 * @param modifierClass - An additional BEM modifier class for sizing.
 * @returns HTML markup for the framed icon.
 */
function renderMaskIcon(src: string, color: string, modifierClass: string): string {
  return `
    <span class="gameover__icon-frame" aria-hidden="true">
      <span class="gameover__icon ${modifierClass}" style="--mask-src:url('${src}'); color:${color}"></span>
    </span>
  `;
}

/**
 * Returns the HTML content section for a winner result.
 * @param winner - The player who won.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the winner reveal.
 */
function renderWinnerContent(winner: PlayerColor, theme: ThemeConfig): string {
  const playerLabel = winner === 'blue' ? 'Blue Player' : 'Orange Player';
  const playerColor  = playerCssColor(winner);
  const winnerVisual = theme.winnerImage
    ? `<img class="gameover__winner-image" src="${theme.winnerImage}" alt="" aria-hidden="true" />`
    : renderMaskIcon(PAWN_ICON_PATH, playerColor, 'gameover__icon--pawn');
  return `
    <div class="gameover__result">
      <p class="gameover__label" style="color:${theme.result?.labelColor ?? theme.gameoverTextColor}">The winner is</p>
      <strong class="gameover__winner-name" style="color:${theme.winnerNameColor ?? playerColor}">${playerLabel}</strong>
      ${winnerVisual}
    </div>
  `;
}

/**
 * Returns the HTML content section for a draw result.
 * @param textColor - The color for the "It's a" label text.
 * @param accentColor - The theme's accent color, used for the "DRAW" text and icon.
 * @returns HTML markup for the draw reveal.
 */
function renderDrawContent(textColor: string, accentColor: string): string {
  return `
    <div class="gameover__result">
      <p class="gameover__label" style="color:${textColor}">It's a</p>
      <strong class="gameover__draw-text" style="color:${accentColor}">DRAW</strong>
      ${renderMaskIcon(SCALE_ICON_PATH, accentColor, 'gameover__icon--scale')}
    </div>
  `;
}

/**
 * Returns the stage-2 result content (winner or draw) for the given game outcome.
 * @param result - The final outcome of the game.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the winner or draw reveal.
 */
function renderResultContent(result: EndResult, theme: ThemeConfig): string {
  if (result === 'blue-wins')   return renderWinnerContent('blue', theme);
  if (result === 'orange-wins') return renderWinnerContent('orange', theme);
  return renderDrawContent(theme.result?.drawLabelColor ?? theme.gameoverTextColor, theme.accentColor);
}

/**
 * Returns the themed "Game over" title markup.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the title `<h1>`.
 */
function renderTitle(theme: ThemeConfig): string {
  const titleClass = theme.titleUppercase ? 'gameover__title gameover__title--upper' : 'gameover__title';
  const titleStyle = `color:${theme.titleColor}; font-family:${theme.titleFont}; font-weight:${theme.titleWeight}`;
  return `<h1 class="${titleClass}" style="${titleStyle}">Game over</h1>`;
}

/**
 * Returns the stage-1 section: title, final-score label and score box.
 * @param theme - The active theme's visual configuration.
 * @param scores - The final score for each player.
 * @returns HTML markup for the stage-1 `<section>`.
 */
function renderStage1(theme: ThemeConfig, scores: Record<PlayerColor, number>): string {
  return `
    <section class="gameover__stage1">
      ${renderTitle(theme)}
      <p class="gameover__final-label" style="color:${theme.gameoverTextColor}">Final score</p>
      ${renderScoresBox(scores, theme.scoreBox)}
    </section>
  `;
}

/**
 * Returns the stage-2 section: the delayed winner/draw reveal and the back button.
 * @param result - The final outcome of the game.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the stage-2 `<section>`.
 */
function renderStage2(result: EndResult, theme: ThemeConfig): string {
  const { bg, border, text } = theme.gameoverBackBtn;
  const backBtnStyle = `--back-bg:${bg}; --back-border:${border}; color:${text}; --back-hover-color:${theme.exitBtnHoverColor}`;
  return `
    <section class="gameover__stage2" style="background:${theme.result?.bg ?? theme.gameoverBg}">
      ${result === 'draw' || !theme.winnerConfetti ? '' : `<img class="gameover__confetti" src="${CONFETTI_PATH}" alt="" aria-hidden="true" />`}
      ${renderResultContent(result, theme)}
      <button class="btn btn--back" id="gameover-back-btn" style="${backBtnStyle}">${theme.gameoverBackBtn.label}</button>
    </section>
  `;
}

/**
 * Returns the full HTML markup for the game-over screen.
 * @returns HTML markup for the `<main>` game-over screen element.
 */
export function renderGameover(): string {
  const state  = getState();
  const theme  = getTheme(state.settings.theme as ThemeName);
  const result = getResult();

  return `
    <main class="gameover" data-theme="${state.settings.theme}" style="background:${theme.gameoverBg}">
      ${renderStage1(theme, state.scores)}
      ${renderStage2(result, theme)}
    </main>
  `;
}

/** Attaches event listeners for the game-over screen. */
export function initGameover(): void {
  document.getElementById('gameover-back-btn')?.addEventListener('click', () => {
    setState({ screen: 'settings', cards: [], flippedIndexes: [], scores: { blue: 0, orange: 0 } });
    render();
  });
}
