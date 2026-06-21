import { setState } from '../state/game-state';
import { render } from '../main';

const CONTROLLER_ICON_PATH = `${import.meta.env.BASE_URL}ui/controller.svg`;

/** Returns the full HTML markup for the home screen. */
export function renderHome(): string {
  return `
    <main class="home">
      <div class="home__bg-controller">
        <img src="${CONTROLLER_ICON_PATH}" alt="" aria-hidden="true" />
      </div>
      <div class="home__content">
        <p class="home__subtitle">It's play time.</p>
        <h1 class="home__title">Ready to play?</h1>
        <button class="play-btn" id="home-play-btn" aria-label="Start the game">
          <img class="play-btn__icon" src="${CONTROLLER_ICON_PATH}" alt="" aria-hidden="true" />
          <span class="play-btn__label">Play</span>
          <span class="play-btn__arrow" aria-hidden="true">→</span>
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
