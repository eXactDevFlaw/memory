import { getState, resetToHome } from '../state/gameState';
import { getTheme } from '../data/themes';
import { render } from '../main';

type EndResult = 'blue-wins' | 'orange-wins' | 'draw';

function getResult(): EndResult {
  const { scores } = getState();
  if (scores.blue > scores.orange)   return 'blue-wins';
  if (scores.orange > scores.blue)   return 'orange-wins';
  return 'draw';
}

function renderWinner(winner: 'blue' | 'orange', textColor: string): string {
  const playerLabel = winner === 'blue' ? 'Blue Player' : 'Orange Player';
  const icon = winner === 'blue'
    ? `<svg viewBox="0 0 24 24" fill="currentColor" class="gameover__icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="currentColor" class="gameover__icon"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

  // Trophy icon for both winners
  const trophyIcon = `
    <svg viewBox="0 0 24 24" fill="currentColor" class="gameover__icon">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
    </svg>
  `;

  return `
    <div class="gameover__result gameover__result--winner">
      ${trophyIcon}
      <p class="gameover__label" style="color:${textColor}">The winner is</p>
      <h2 class="gameover__winner-name" style="color:${textColor}">${playerLabel}</h2>
    </div>
  `;
}

function renderDraw(textColor: string): string {
  const scaleIcon = `
    <svg viewBox="0 0 24 24" fill="currentColor" class="gameover__icon">
      <path d="M17 2H7c-1.1 0-2 .9-2 2v1H3v2h2v1c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7h2V5h-2V4c0-1.1-.9-2-2-2zm0 6H7V4h10v4zM12 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  `;
  return `
    <div class="gameover__result gameover__result--draw">
      ${scaleIcon}
      <p class="gameover__label" style="color:${textColor}">It's a</p>
      <h2 class="gameover__draw-text" style="color:${textColor}">DRAW</h2>
    </div>
  `;
}

export function renderGameover(): string {
  const state  = getState();
  const theme  = getTheme(state.settings.theme);
  const result = getResult();

  const bgColor   = result === 'draw' ? theme.bgColor : theme.bgColor;
  const textColor = theme.textColor;

  let resultHtml = '';
  if      (result === 'blue-wins')   resultHtml = renderWinner('blue',   textColor);
  else if (result === 'orange-wins') resultHtml = renderWinner('orange', textColor);
  else                               resultHtml = renderDraw(textColor);

  return `
    <div class="gameover" style="background:${bgColor}">
      <div class="gameover__header" style="background:${theme.gameoverBg}">
        <h1 class="gameover__title" style="color:${theme.accentColor}">Game over</h1>
      </div>

      <div class="gameover__content">
        ${resultHtml}

        <div class="gameover__scores">
          <div class="gameover__score-item">
            <span class="scorebar__dot scorebar__dot--blue"></span>
            <span style="color:${textColor}">Blue: ${state.scores.blue}</span>
          </div>
          <div class="gameover__score-item">
            <span class="scorebar__dot scorebar__dot--orange"></span>
            <span style="color:${textColor}">Orange: ${state.scores.orange}</span>
          </div>
        </div>

        <button class="btn btn--back" id="gameover-back-btn">
          Back to start
        </button>
      </div>
    </div>
  `;
}

export function initGameover(): void {
  document.getElementById('gameover-back-btn')?.addEventListener('click', () => {
    resetToHome();
    render();
  });
}
