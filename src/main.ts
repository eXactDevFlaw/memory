import './styles/style.scss';
import { getState } from './state/gameState';
import { renderHome,     initHome }     from './pages/home';
import { renderSettings, initSettings } from './pages/settings';
import { renderGame,     initGame }     from './pages/game';
import { renderGameover, initGameover } from './pages/gameover';

const app = document.getElementById('app')!;

export function render(): void {
  const { screen } = getState();

  switch (screen) {
    case 'home':
      app.innerHTML = renderHome();
      initHome();
      break;
    case 'settings':
      app.innerHTML = renderSettings();
      initSettings();
      break;
    case 'game':
      app.innerHTML = renderGame();
      initGame();
      break;
    case 'gameover':
      app.innerHTML = renderGameover();
      initGameover();
      break;
  }
}

render();
