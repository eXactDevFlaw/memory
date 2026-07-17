import { getState, resetToHome } from '../state/game-state';
import { getTheme } from '../data/themes';
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

/** Returns a mask-colored icon span for an arbitrary SVG asset. */
function renderMaskIcon(src: string, color: string, modifierClass: string): string {
  return `<span class="gameover__icon ${modifierClass}" style="--mask-src:url('${src}'); color:${color}" aria-hidden="true"></span>`;
}

/** Returns the HTML content section for a winner result. */
function renderWinnerContent(winner: PlayerColor, textColor: string): string {
  const playerLabel = winner === 'blue' ? 'Blue Player' : 'Orange Player';
  const playerColor = winner === 'blue' ? 'var(--color-blue)' : 'var(--color-orange)';
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

/** Returns the HTML for the final score display. */
function renderFinalScores(scores: Record<PlayerColor, number>): string {
  return `
    <div class="gameover__scores">
      <div class="gameover__score-pill gameover__score-pill--blue">
        <span class="gameover__score-tag" style="--mask-src:url('${SCORE_TAG_PATH}')" aria-hidden="true"></span>
        Blue ${scores.blue}
      </div>
      <div class="gameover__score-pill gameover__score-pill--orange">
        <span class="gameover__score-tag" style="--mask-src:url('${SCORE_TAG_PATH}')" aria-hidden="true"></span>
        Orange ${scores.orange}
      </div>
    </div>
  `;
}

/** Returns the full HTML markup for the game-over screen. */
export function renderGameover(): string {
  const state   = getState();
  const theme   = getTheme(state.settings.theme);
  const result  = getResult();

  let resultHtml = '';
  if (result === 'blue-wins')   resultHtml = renderWinnerContent('blue',   theme.textColor);
  if (result === 'orange-wins') resultHtml = renderWinnerContent('orange', theme.textColor);
  if (result === 'draw')        resultHtml = renderDrawContent(theme.textColor, theme.accentColor);

  return `
    <main class="gameover" style="background:${theme.bgColor}">
      <section class="gameover__stage1">
        <h1 class="gameover__title" style="color:${theme.accentColor}">Game over</h1>
        <p class="gameover__final-label" style="color:${theme.textColor}">Final score</p>
        ${renderFinalScores(state.scores)}
      </section>
      <section class="gameover__stage2" style="background:${theme.bgColor}">
        ${resultHtml}
        <button class="btn btn--back" id="gameover-back-btn">
          Back to start
        </button>
      </section>
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
