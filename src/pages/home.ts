import { setState } from '../state/game-state';
import { render } from '../main';

/** Returns the SVG markup for the decorative background controller. */
function renderControllerSvg(): string {
  return `
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
      <path d="M24 20 C14 20 6 28 4 40 L2 58 C1 66 6 70 12 70 C17 70 21 67 24 62 L28 54 L92 54 L96 62 C99 67 103 70 108 70 C114 70 119 66 118 58 L116 40 C114 28 106 20 96 20 Z"/>
      <rect x="28" y="28" width="5" height="16" rx="2.5"/>
      <rect x="22" y="34" width="17" height="5" rx="2.5"/>
      <circle cx="82" cy="30" r="4"/>
      <circle cx="92" cy="38" r="4"/>
      <circle cx="72" cy="38" r="4"/>
      <circle cx="82" cy="46" r="4"/>
      <circle cx="44" cy="42" r="7"/>
      <rect x="53" y="36" width="14" height="4" rx="2"/>
      <rect x="57" y="32" width="6" height="12" rx="2"/>
    </svg>
  `;
}

/** Returns the SVG icon used inside the play button. */
function renderPlayButtonIcon(): string {
  return `
    <svg class="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 12C17 14.21 15.21 16 13 16H11C8.79 16 7 14.21 7 12V8C7 5.79 8.79 4 11 4H13C15.21 4 17 5.79 17 8M21 12C21 6.48 16.52 2 11 2C5.48 2 1 6.48 1 12C1 17.52 5.48 22 11 22C16.52 22 21 17.52 21 12Z"/>
    </svg>
  `;
}

/** Returns the full HTML markup for the home screen. */
export function renderHome(): string {
  return `
    <main class="home">
      <div class="home__bg-controller">
        ${renderControllerSvg()}
      </div>
      <div class="home__content">
        <p class="home__subtitle">It's play time.</p>
        <h1 class="home__title">Ready to play?</h1>
        <button class="btn btn--play" id="home-play-btn" aria-label="Start the game">
          ${renderPlayButtonIcon()}
          Play
          <span class="btn__arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  `;
}

/** Attaches event listeners for the home screen. */
export function initHome(): void {
  document.getElementById('home-play-btn')?.addEventListener('click', () => {
    setState({ screen: 'settings' });
    render();
  });
}
