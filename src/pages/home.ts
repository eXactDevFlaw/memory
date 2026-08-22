import { setState } from '../state/game-state';
import { render } from '../main';

const CONTROLLER_ICON_PATH = `${import.meta.env.BASE_URL}ui/controller.svg`;
const PLAY_BTN_ICON_PATH = `${import.meta.env.BASE_URL}ui/play-btn.svg`;
const PLAY_BTN_HOVER_ICON_PATH = `${import.meta.env.BASE_URL}ui/play-btn-hover.svg`;

/**
 * Returns the floating background controller illustration.
 * @returns HTML markup for the decorative controller graphic.
 */
function renderBgController(): string {
  return `
    <div class="home__bg-controller">
      <img src="${CONTROLLER_ICON_PATH}" alt="" aria-hidden="true" />
    </div>
  `;
}

/**
 * Returns the headline and play button block.
 * @returns HTML markup for the home screen's main content.
 */
function renderContent(): string {
  return `
    <div class="home__content">
      <p class="home__subtitle">It's play time.</p>
      <h1 class="home__title">Ready to play?</h1>
      <button class="play-btn" id="home-play-btn" aria-label="Start the game">
        <img class="play-btn__icon" src="${PLAY_BTN_ICON_PATH}" alt="Play" />
      </button>
    </div>
  `;
}

/**
 * Returns the full HTML markup for the home screen.
 * @returns HTML markup for the `<main>` home screen element.
 */
export function renderHome(): string {
  return `
    <main class="home">
      ${renderBgController()}
      ${renderContent()}
    </main>
  `;
}

/**
 * Swaps the play button's icon between normal and hover artwork on interaction.
 * @param btn - The play button element to bind hover/focus listeners to.
 * @param icon - The button's icon image element whose `src` is swapped.
 */
function bindPlayButtonHover(btn: HTMLElement, icon: HTMLImageElement | null | undefined): void {
  const setHover  = () => { if (icon) icon.src = PLAY_BTN_HOVER_ICON_PATH; };
  const setNormal = () => { if (icon) icon.src = PLAY_BTN_ICON_PATH; };

  btn.addEventListener('mouseenter', setHover);
  btn.addEventListener('mouseleave', setNormal);
  btn.addEventListener('focus', setHover);
  btn.addEventListener('blur', setNormal);
}

/** Attaches event listeners for the home screen. */
export function initHome(): void {
  const playBtn  = document.getElementById('home-play-btn');
  const playIcon = playBtn?.querySelector<HTMLImageElement>('.play-btn__icon');
  if (playBtn) bindPlayButtonHover(playBtn, playIcon);

  playBtn?.addEventListener('click', () => {
    setState({ screen: 'settings' });
    render();
  });
}
