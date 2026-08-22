import './styles/style.scss';
import { getState } from './state/game-state';
import { renderHome,     initHome }     from './pages/home';
import { renderSettings, initSettings } from './pages/settings';
import { renderGame,     initGame }     from './pages/game';
import { renderGameover, initGameover } from './pages/gameover';
import type { GameScreen } from './types/index';

const APP = document.getElementById('app')!;

/** A screen's HTML-producing and event-binding functions. */
type ScreenModule = { render: () => string; init: () => void };

const SCREENS: Record<GameScreen, ScreenModule> = {
  home:     { render: renderHome,     init: initHome },
  settings: { render: renderSettings, init: initSettings },
  game:     { render: renderGame,     init: initGame },
  gameover: { render: renderGameover, init: initGameover },
};

/** Renders the correct screen based on the current game state. */
export function render(): void {
  const screen = SCREENS[getState().screen];
  APP.innerHTML = screen.render();
  screen.init();
}

render();
