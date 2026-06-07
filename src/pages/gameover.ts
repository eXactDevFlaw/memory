import { getState, resetToHome } from '../state/game-state';
import { getTheme } from '../data/themes';
import { render } from '../main';
import type { PlayerColor } from '../types/index';

type EndResult = 'blue-wins' | 'orange-wins' | 'draw';

/** Determines the end result based on the final scores. */
function getResult(): EndResult {
  const { scores } = getState();
  if (scores.blue > scores.orange) return 'blue-wins';
  if (scores.orange > scores.blue) return 'orange-wins';
  return 'draw';
}

/** Returns the trophy SVG icon used on the winner screen. */
function renderTrophyIcon(): string {
  return `
    <svg viewBox="0 0 24 24" fill="currentColor" class="gameover__icon" aria-hidden="true">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
    </svg>
  `;
}

/** Returns the scale SVG icon used on the draw screen. */
function renderScaleIcon(): string {
  return `
    <svg viewBox="0 0 24 24" fill="currentColor" class="gameover__icon" aria-hidden="true">
      <path d="M17 2H7c-1.1 0-2 .9-2 2v1H3v2h2v1c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7h2V5h-2V4c0-1.1-.9-2-2-2zm0 6H7V4h10v4zM12 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  `;
}

/** Returns the HTML content section for a winner result. */
function renderWinnerContent(winner: PlayerColor, textColor: string): string {
  const playerLabel = winner === 'blue' ? 'Blue Player' : 'Orange Player';
  return `
    <div class="gameover__result">
      ${renderTrophyIcon()}
      <p class="gameover__label" style="color:${textColor}">The winner is</p>
      <strong class="gameover__winner-name" style="color:${textColor}">${playerLabel}</strong>
    </div>
  `;
}

/** Returns the HTML content section for a draw result. */
function renderDrawContent(textColor: string): string {
  return `
    <div class="gameover__result">
      ${renderScaleIcon()}
      <p class="gameover__label" style="color:${textColor}">It's a</p>
      <strong class="gameover__draw-text" style="color:${textColor}">DRAW</strong>
    </div>
  `;
}

/** Returns the HTML for the final score display. */
function renderFinalScores(scores: Record<PlayerColor, number>, textColor: string): string {
  return `
    <div class="gameover__scores">
      <div class="gameover__score-item">
        <span class="scorebar__dot scorebar__dot--blue"></span>
        <span style="color:${textColor}">Blue: ${scores.blue}</span>
      </div>
      <div class="gameover__score-item">
        <span class="scorebar__dot scorebar__dot--orange"></span>
        <span style="color:${textColor}">Orange: ${scores.orange}</span>
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
  if (result === 'draw')        resultHtml = renderDrawContent(theme.textColor);

  return `
    <main class="gameover" style="background:${theme.bgColor}">
      <header class="gameover__header" style="background:${theme.gameoverBg}">
        <h1 class="gameover__title" style="color:${theme.accentColor}">Game over</h1>
      </header>
      <section class="gameover__content">
        ${resultHtml}
        ${renderFinalScores(state.scores, theme.textColor)}
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
