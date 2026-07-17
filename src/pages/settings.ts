import { getState, setState } from '../state/game-state';
import { getThemePreviewHtml, THEMES } from '../data/themes';
import { render } from '../main';
import type { ThemeName, PlayerColor, BoardSize, GameSettings } from '../types/index';

const ICON_THEME_PATH     = `${import.meta.env.BASE_URL}ui/icon-theme.svg`;
const ICON_PLAYER_PATH    = `${import.meta.env.BASE_URL}ui/icon-player.svg`;
const ICON_BOARDSIZE_PATH = `${import.meta.env.BASE_URL}ui/icon-boardsize.svg`;

const THEME_OPTIONS: { value: ThemeName; label: string }[] = [
  { value: 'code-vibes',  label: 'Code vibes theme' },
  { value: 'gaming',      label: 'Gaming theme' },
  { value: 'da-projects', label: 'DA Projects theme' },
  { value: 'food',        label: 'Foods theme' },
];

const PLAYER_OPTIONS: { value: PlayerColor; label: string }[] = [
  { value: 'blue',   label: 'Blue' },
  { value: 'orange', label: 'Orange' },
];

const SIZE_OPTIONS: { value: BoardSize; label: string }[] = [
  { value: 16, label: '16 cards' },
  { value: 24, label: '24 cards' },
  { value: 36, label: '36 cards' },
];

/** Returns a radio input group as HTML for a given set of options. */
function renderRadioGroup<T extends string | number>(
  name: string,
  options: { value: T; label: string }[],
  current: T,
): string {
  return options.map(opt => `
    <li>
      <label class="settings__radio-label">
        <input
          type="radio"
          name="${name}"
          value="${opt.value}"
          class="settings__radio-input"
          ${current === opt.value ? 'checked' : ''}
        >
        <span class="settings__radio-custom"></span>
        ${opt.label}
        <span class="settings__radio-flourish" aria-hidden="true"></span>
      </label>
    </li>
  `).join('');
}

/** Returns the HTML for the three settings fieldsets. */
function renderForm(settings: GameSettings): string {
  return `
    <form class="settings__form">
      <fieldset class="settings__group">
        <legend class="settings__group-legend">
          <img class="settings__group-icon" src="${ICON_THEME_PATH}" alt="" aria-hidden="true" />
          Game themes
        </legend>
        <ul class="settings__radio-list">
          ${renderRadioGroup('theme', THEME_OPTIONS, settings.theme)}
        </ul>
      </fieldset>
      <fieldset class="settings__group">
        <legend class="settings__group-legend">
          <img class="settings__group-icon" src="${ICON_PLAYER_PATH}" alt="" aria-hidden="true" />
          Choose player
        </legend>
        <ul class="settings__radio-list">
          ${renderRadioGroup('player', PLAYER_OPTIONS, settings.player)}
        </ul>
      </fieldset>
      <fieldset class="settings__group">
        <legend class="settings__group-legend">
          <img class="settings__group-icon" src="${ICON_BOARDSIZE_PATH}" alt="" aria-hidden="true" />
          Board size
        </legend>
        <ul class="settings__radio-list">
          ${renderRadioGroup('boardSize', SIZE_OPTIONS, settings.boardSize)}
        </ul>
      </fieldset>
    </form>
  `;
}

/** Returns the bottom status bar showing current selections. */
function renderBar(settings: GameSettings): string {
  const playerLabel = settings.player === 'blue' ? 'Blue Player' : 'Orange Player';
  return `
    <div class="settings__bar">
      <nav class="settings__bar-steps" aria-label="Settings progress">
        <span class="settings__bar-step" id="bar-theme">${THEMES[settings.theme].name}</span>
        <span class="settings__bar-sep" aria-hidden="true"></span>
        <span class="settings__bar-step" id="bar-player">${playerLabel}</span>
        <span class="settings__bar-sep" aria-hidden="true"></span>
        <span class="settings__bar-step" id="bar-size">${settings.boardSize} Cards</span>
      </nav>
      <button class="btn btn--start" id="settings-start-btn">
        <span class="btn--start__icon" aria-hidden="true">▶</span> Start
      </button>
    </div>
  `;
}

/** Returns the full HTML markup for the settings screen. */
export function renderSettings(): string {
  const { settings } = getState();
  return `
    <main class="settings">
      <div class="settings__inner">
        <h1 class="settings__title">Settings</h1>
        <div class="settings__body">
          ${renderForm(settings)}
          <div class="settings__preview-area" id="settings-preview">
            ${getThemePreviewHtml(settings.theme)}
          </div>
        </div>
        ${renderBar(settings)}
      </div>
    </main>
  `;
}

/** Updates the settings bar labels and theme preview to reflect current state. */
function updatePreview(): void {
  const { settings } = getState();
  const preview   = document.getElementById('settings-preview');
  const barTheme  = document.getElementById('bar-theme');
  const barPlayer = document.getElementById('bar-player');
  const barSize   = document.getElementById('bar-size');

  if (preview)   preview.innerHTML   = getThemePreviewHtml(settings.theme);
  if (barTheme)  barTheme.textContent  = THEMES[settings.theme].name;
  if (barPlayer) barPlayer.textContent = settings.player === 'blue' ? 'Blue Player' : 'Orange Player';
  if (barSize)   barSize.textContent   = `${settings.boardSize} Cards`;
}

/** Attaches event listeners for the settings screen. */
export function initSettings(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(input => {
    input.addEventListener('change', () => {
      setState({ settings: { ...getState().settings, theme: input.value as ThemeName } });
      updatePreview();
    });
  });

  document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(input => {
    input.addEventListener('change', () => {
      setState({ settings: { ...getState().settings, player: input.value as PlayerColor } });
      updatePreview();
    });
  });

  document.querySelectorAll<HTMLInputElement>('input[name="boardSize"]').forEach(input => {
    input.addEventListener('change', () => {
      setState({ settings: { ...getState().settings, boardSize: Number(input.value) as BoardSize } });
      updatePreview();
    });
  });

  document.getElementById('settings-start-btn')?.addEventListener('click', () => {
    setState({
      screen: 'game',
      currentPlayer: getState().settings.player,
      scores: { blue: 0, orange: 0 },
    });
    render();
  });
}
