import { getState, resetToHome } from '../state/game-state';
import { getTheme, type ThemeConfig } from '../data/themes';
import { render } from '../main';
import type { PlayerColor } from '../types/index';

type EndResult = 'blue-wins' | 'orange-wins' | 'draw';

const CONFETTI_PATH = `${import.meta.env.BASE_URL}ui/Confetti.svg`;
const PAWN_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-player.svg`;
const SCALE_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-scale.svg`;
const SCORE_TAG_PATH = `${import.meta.env.BASE_URL}ui/label.svg`;

/** Determines the end result based on the final scores. */
function getResult(): EndResult {
  const { scores } = getState();
  if (scores.blue > scores.orange) return 'blue-wins';
  if (scores.orange > scores.blue) return 'orange-wins';
  return 'draw';
}

/** Returns the CSS custom-property color for a player. */
function playerCssColor(player: PlayerColor): string {
  return player === 'blue' ? 'var(--color-blue)' : 'var(--color-orange)';
}

/** Returns a mask-colored icon span for an arbitrary SVG asset. */
function renderMaskIcon(src: string, color: string, modifierClass: string): string {
  return `<span class="gameover__icon ${modifierClass}" style="--mask-src:url('${src}'); color:${color}" aria-hidden="true"></span>`;
}

/** Returns a mask-colored icon span for the final-score pill (no entrance animation). */
function renderScoreIcon(src: string, color: string, modifierClass: string): string {
  return `<span class="gameover__score-icon ${modifierClass}" style="--mask-src:url('${src}'); color:${color}" aria-hidden="true"></span>`;
}

/** Returns the HTML content section for a winner result. */
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

/** Returns the HTML content section for a draw result. */
function renderDrawContent(textColor: string, accentColor: string): string {
  return `
    <div class="gameover__result">
      <p class="gameover__label" style="color:${textColor}">It's a</p>
      <strong class="gameover__draw-text" style="color:${accentColor}">DRAW</strong>
      ${renderMaskIcon(SCALE_ICON_PATH, accentColor, 'gameover__icon--scale')}
    </div>
  `;
}

/** Returns the stage-2 result content (winner or draw) for the given game outcome. */
function renderResultContent(result: EndResult, theme: ThemeConfig): string {
  if (result === 'blue-wins')   return renderWinnerContent('blue', theme.gameoverTextColor);
  if (result === 'orange-wins') return renderWinnerContent('orange', theme.gameoverTextColor);
  return renderDrawContent(theme.gameoverTextColor, theme.accentColor);
}

/** Returns a "labeled" score entry: icon + player name + score, in one color. */
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

/** Returns a "compact" score entry: icon + score only, in one color. */
function renderCompactScoreEntry(player: PlayerColor, score: number): string {
  const playerColor = playerCssColor(player);
  return `
    <div class="gameover__score-entry" style="color:${playerColor}">
      ${renderScoreIcon(PAWN_ICON_PATH, playerColor, 'gameover__score-icon--pawn')}
      ${score}
    </div>
  `;
}

/** Returns the HTML for a single player's entry within the final-score pill. */
function renderScoreEntry(player: PlayerColor, score: number, theme: ThemeConfig): string {
  return theme.scoreLayout === 'labeled'
    ? renderLabeledScoreEntry(player, score)
    : renderCompactScoreEntry(player, score);
}

/** Returns the HTML for the final score display, themed per the current theme's score layout. */
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

/** Returns the themed "Game over" title markup. */
function renderTitle(theme: ThemeConfig): string {
  const titleClass = theme.titleUppercase ? 'gameover__title gameover__title--upper' : 'gameover__title';
  const titleStyle = `color:${theme.titleColor}; font-family:${theme.titleFont}; font-weight:${theme.titleWeight}`;
  return `<h1 class="${titleClass}" style="${titleStyle}">Game over</h1>`;
}

/** Returns the stage-1 section: title, final-score label and score pill. */
function renderStage1(theme: ThemeConfig, scores: Record<PlayerColor, number>): string {
  return `
    <section class="gameover__stage1">
      ${renderTitle(theme)}
      <p class="gameover__final-label" style="color:${theme.gameoverTextColor}">Final score</p>
      ${renderFinalScores(scores, theme)}
    </section>
  `;
}

/** Returns the stage-2 section: the delayed winner/draw reveal and the back button. */
function renderStage2(result: EndResult, theme: ThemeConfig): string {
  return `
    <section class="gameover__stage2" style="background:${theme.bgColor}">
      ${renderResultContent(result, theme)}
      <button class="btn btn--back" id="gameover-back-btn">Back to start</button>
    </section>
  `;
}

/** Returns the full HTML markup for the game-over screen. */
export function renderGameover(): string {
  const state  = getState();
  const theme  = getTheme(state.settings.theme);
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
