import { getState, resetToHome } from '../state/game-state';
import { getTheme, type ThemeConfig } from '../data/themes';
import { render } from '../main';
import type { PlayerColor, ThemeName } from '../types/index';

/** The outcome of a finished game. */
type EndResult = 'blue-wins' | 'orange-wins' | 'draw';

const CONFETTI_PATH = `${import.meta.env.BASE_URL}ui/Confetti.svg`;
const PAWN_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-player.svg`;
const SCALE_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-scale.svg`;
const SCORE_TAG_PATH = `${import.meta.env.BASE_URL}ui/label.svg`;

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
 * Returns a mask-colored icon span for an arbitrary SVG asset.
 * @param src - The URL of the SVG used as the mask image.
 * @param color - The icon's fill color.
 * @param modifierClass - An additional BEM modifier class for sizing.
 * @returns HTML markup for the icon `<span>`.
 */
function renderMaskIcon(src: string, color: string, modifierClass: string): string {
  return `<span class="gameover__icon ${modifierClass}" style="--mask-src:url('${src}'); color:${color}" aria-hidden="true"></span>`;
}

/**
 * Returns a mask-colored icon span for the final-score pill (no entrance animation).
 * @param src - The URL of the SVG used as the mask image.
 * @param color - The icon's fill color.
 * @param modifierClass - An additional BEM modifier class for sizing.
 * @returns HTML markup for the icon `<span>`.
 */
function renderScoreIcon(src: string, color: string, modifierClass: string): string {
  return `<span class="gameover__score-icon ${modifierClass}" style="--mask-src:url('${src}'); color:${color}" aria-hidden="true"></span>`;
}

/**
 * Returns the HTML content section for a winner result.
 * @param winner - The player who won.
 * @param textColor - The color for the "The winner is" label text.
 * @returns HTML markup for the winner reveal.
 */
function renderWinnerContent(winner: PlayerColor, textColor: string): string {
  const playerLabel = winner === 'blue' ? 'Blue Player' : 'Orange Player';
  const playerColor  = playerCssColor(winner);
  return `
    <div class="gameover__result gameover__result--winner">
      <img class="gameover__confetti" src="${CONFETTI_PATH}" alt="" aria-hidden="true" />
      <p class="gameover__label" style="color:${textColor}">The winner is</p>
      <strong class="gameover__winner-name" style="color:${playerColor}">${playerLabel}</strong>
      ${renderMaskIcon(PAWN_ICON_PATH, playerColor, 'gameover__icon--pawn')}
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
  if (result === 'blue-wins')   return renderWinnerContent('blue', theme.gameoverTextColor);
  if (result === 'orange-wins') return renderWinnerContent('orange', theme.gameoverTextColor);
  return renderDrawContent(theme.gameoverTextColor, theme.accentColor);
}

/**
 * Returns a "labeled" score entry: icon + player name + score, in one color.
 * @param player - The player this entry represents.
 * @param score - The player's final score.
 * @returns HTML markup for one score entry.
 */
function renderLabeledScoreEntry(player: PlayerColor, score: number): string {
  const playerColor = playerCssColor(player);
  const label = player === 'blue' ? 'Blue' : 'Orange';
  return `
    <div class="gameover__score-entry" style="color:${playerColor}">
      ${renderScoreIcon(SCORE_TAG_PATH, playerColor, 'gameover__score-icon--tag')}
      ${label} ${score}
    </div>
  `;
}

/**
 * Returns a "compact" score entry: icon + score only, in one color.
 * @param player - The player this entry represents.
 * @param score - The player's final score.
 * @returns HTML markup for one score entry.
 */
function renderCompactScoreEntry(player: PlayerColor, score: number): string {
  const playerColor = playerCssColor(player);
  return `
    <div class="gameover__score-entry" style="color:${playerColor}">
      ${renderScoreIcon(PAWN_ICON_PATH, playerColor, 'gameover__score-icon--pawn')}
      ${score}
    </div>
  `;
}

/**
 * Returns the HTML for a single player's entry within the final-score pill.
 * @param player - The player this entry represents.
 * @param score - The player's final score.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for one score entry, in the theme's layout style.
 */
function renderScoreEntry(player: PlayerColor, score: number, theme: ThemeConfig): string {
  return theme.scoreLayout === 'labeled'
    ? renderLabeledScoreEntry(player, score)
    : renderCompactScoreEntry(player, score);
}

/**
 * Returns the HTML for the final score display, themed per the current theme's score layout.
 * @param scores - The final score for each player.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the final-score pill.
 */
function renderFinalScores(scores: Record<PlayerColor, number>, theme: ThemeConfig): string {
  const entries = theme.scoreOrder
    .map(player => renderScoreEntry(player, scores[player], theme))
    .join('');
  return `
    <div class="gameover__scores gameover__scores--${theme.scoreLayout}" style="background:${theme.scorePillBg}">
      ${entries}
    </div>
  `;
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
 * Returns the stage-1 section: title, final-score label and score pill.
 * @param theme - The active theme's visual configuration.
 * @param scores - The final score for each player.
 * @returns HTML markup for the stage-1 `<section>`.
 */
function renderStage1(theme: ThemeConfig, scores: Record<PlayerColor, number>): string {
  return `
    <section class="gameover__stage1">
      ${renderTitle(theme)}
      <p class="gameover__final-label" style="color:${theme.gameoverTextColor}">Final score</p>
      ${renderFinalScores(scores, theme)}
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
  const backBtnStyle = `background:${bg}; border:${border}; color:${text}`;
  return `
    <section class="gameover__stage2" style="background:${theme.bgColor}">
      ${renderResultContent(result, theme)}
      <button class="btn btn--back" id="gameover-back-btn" style="${backBtnStyle}">Back to start</button>
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
    <main class="gameover" style="background:${theme.bgColor}">
      ${renderStage1(theme, state.scores)}
      ${renderStage2(result, theme)}
    </main>
  `;
}

/** Attaches event listeners for the game-over screen. */
export function initGameover(): void {
  document.getElementById('gameover-back-btn')?.addEventListener('click', () => {
    resetToHome();
    render();
  });
}
