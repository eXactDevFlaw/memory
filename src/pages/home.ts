import { setState } from '../state/game-state';
import { render } from '../main';

const CONTROLLER_ICON_PATH = `${import.meta.env.BASE_URL}ui/controller.svg`;
const PLAY_BTN_ICON_PATH = `${import.meta.env.BASE_URL}ui/play-btn.svg`;
const PLAY_BTN_HOVER_ICON_PATH = `${import.meta.env.BASE_URL}ui/play-btn-hover.svg`;

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
          <img class="play-btn__icon" src="${PLAY_BTN_ICON_PATH}" alt="Play" />
        </button>
      </div>
    </main>
  `;
}

/** Attaches event listeners for the home screen. */
export function initHome(): void {
  const playBtn = document.getElementById('home-play-btn');
  const playIcon = playBtn?.querySelector<HTMLImageElement>('.play-btn__icon');

  playBtn?.addEventListener('mouseenter', () => {
    if (playIcon) playIcon.src = PLAY_BTN_HOVER_ICON_PATH;
  });
  playBtn?.addEventListener('mouseleave', () => {
    if (playIcon) playIcon.src = PLAY_BTN_ICON_PATH;
  });
  playBtn?.addEventListener('focus', () => {
    if (playIcon) playIcon.src = PLAY_BTN_HOVER_ICON_PATH;
  });
  playBtn?.addEventListener('blur', () => {
    if (playIcon) playIcon.src = PLAY_BTN_ICON_PATH;
  });

  playBtn?.addEventListener('click', () => {
    setState({ screen: 'settings' });
    render();
  });
}
