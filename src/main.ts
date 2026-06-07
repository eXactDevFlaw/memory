import './styles/style.scss';
import { getState } from './state/game-state';
import { renderHome,     initHome }     from './pages/home';
import { renderSettings, initSettings } from './pages/settings';
import { renderGame,     initGame }     from './pages/game';
import { renderGameover, initGameover } from './pages/gameover';

const APP = document.getElementById('app')!;

/** Renders the correct screen based on the current game state. */
export function render(): void {
  const { screen } = getState();

  switch (screen) {
    case 'home':
      APP.innerHTML = renderHome();
      initHome();
      break;
    case 'settings':
      APP.innerHTML = renderSettings();
      initSettings();
      break;
    case 'game':
      APP.innerHTML = renderGame();
      initGame();
      break;
    case 'gameover':
      APP.innerHTML = renderGameover();
      initGameover();
      break;
  }
}

render();
