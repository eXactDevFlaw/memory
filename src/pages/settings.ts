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

/**
 * Returns a single radio option as a list item.
 * @param name - The `name` attribute shared by the radio group.
 * @param option - The option's value and display label.
 * @param current - The currently selected value for the group.
 * @returns HTML markup for one `<li>` radio option.
 */
function renderRadioOption<T extends string | number>(
  name: string,
  option: { value: T; label: string },
  current: T,
): string {
  const checked = current === option.value ? 'checked' : '';
  return `
    <li>
      <label class="settings__radio-label">
        <input type="radio" name="${name}" value="${option.value}" class="settings__radio-input" ${checked}>
        <span class="settings__radio-custom"></span>
        ${option.label}
        <span class="settings__radio-flourish" aria-hidden="true"></span>
      </label>
    </li>
  `;
}

/**
 * Returns a radio input group as HTML for a given set of options.
 * @param name - The `name` attribute shared by the radio group.
 * @param options - The selectable value/label pairs.
 * @param current - The currently selected value for the group.
 * @returns HTML markup for the `<li>` options, concatenated.
 */
function renderRadioGroup<T extends string | number>(
  name: string,
  options: { value: T; label: string }[],
  current: T,
): string {
  return options.map(opt => renderRadioOption(name, opt, current)).join('');
}

/**
 * Returns a single settings fieldset (icon + legend + radio options).
 * @param iconSrc - The URL of the legend's icon image.
 * @param legend - The fieldset's legend text.
 * @param name - The `name` attribute shared by the fieldset's radio group.
 * @param options - The selectable value/label pairs.
 * @param current - The currently selected value for the group.
 * @returns HTML markup for the `<fieldset>`.
 */
function renderFieldset<T extends string | number>(
  iconSrc: string,
  legend: string,
  name: string,
  options: { value: T; label: string }[],
  current: T,
): string {
  return `
    <fieldset class="settings__group">
      <legend class="settings__group-legend">
        <img class="settings__group-icon" src="${iconSrc}" alt="" aria-hidden="true" />
        ${legend}
      </legend>
      <ul class="settings__radio-list">
        ${renderRadioGroup(name, options, current)}
      </ul>
    </fieldset>
  `;
}

/**
 * Returns the HTML for the three settings fieldsets.
 * @param settings - The currently selected game settings.
 * @returns HTML markup for the `<form>` containing all fieldsets.
 */
function renderForm(settings: GameSettings): string {
  return `
    <form class="settings__form">
      ${renderFieldset(ICON_THEME_PATH, 'Game themes', 'theme', THEME_OPTIONS, settings.theme)}
      ${renderFieldset(ICON_PLAYER_PATH, 'Choose player', 'player', PLAYER_OPTIONS, settings.player)}
      ${renderFieldset(ICON_BOARDSIZE_PATH, 'Board size', 'boardSize', SIZE_OPTIONS, settings.boardSize)}
    </form>
  `;
}

/**
 * Returns the form and the theme-preview illustration side by side.
 * @param settings - The currently selected game settings.
 * @returns HTML markup for the settings body layout.
 */
function renderBody(settings: GameSettings): string {
  return `
    <div class="settings__body">
      ${renderForm(settings)}
      <aside class="settings__preview-area" id="settings-preview">
        ${getThemePreviewHtml(settings.theme)}
      </aside>
    </div>
  `;
}

/**
 * Returns the step indicators shown in the bottom status bar.
 * @param settings - The currently selected game settings.
 * @returns HTML markup for the breadcrumb-style step list.
 */
function renderBarSteps(settings: GameSettings): string {
  const playerLabel = settings.player === 'blue' ? 'Blue Player' : 'Orange Player';
  return `
    <nav aria-label="Settings progress">
      <ol class="settings__bar-steps">
        <li class="settings__bar-step" id="bar-theme">${THEMES[settings.theme].name}</li>
        <li class="settings__bar-step" id="bar-player">${playerLabel}</li>
        <li class="settings__bar-step" id="bar-size">${settings.boardSize} Cards</li>
      </ol>
    </nav>
  `;
}

/**
 * Returns the bottom status bar showing current selections.
 * @param settings - The currently selected game settings.
 * @returns HTML markup for the bottom bar, including the Start button.
 */
function renderBar(settings: GameSettings): string {
  return `
    <div class="settings__bar">
      ${renderBarSteps(settings)}
      <button class="btn btn--start" id="settings-start-btn">
        <span class="btn--start__icon" aria-hidden="true">▶</span> Start
      </button>
    </div>
  `;
}

/**
 * Returns the full HTML markup for the settings screen.
 * @returns HTML markup for the `<main>` settings screen element.
 */
export function renderSettings(): string {
  const { settings } = getState();
  return `
    <main class="settings">
      <div class="settings__inner">
        <h1 class="settings__title">Settings</h1>
        ${renderBody(settings)}
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

/** Wires up the theme radio inputs. */
function bindThemeInputs(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(input => {
    input.addEventListener('change', () => {
      setState({ settings: { ...getState().settings, theme: input.value as ThemeName } });
      updatePreview();
    });
  });
}

/** Wires up the player radio inputs. */
function bindPlayerInputs(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(input => {
    input.addEventListener('change', () => {
      setState({ settings: { ...getState().settings, player: input.value as PlayerColor } });
      updatePreview();
    });
  });
}

/** Wires up the board-size radio inputs. */
function bindBoardSizeInputs(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="boardSize"]').forEach(input => {
    input.addEventListener('change', () => {
      setState({ settings: { ...getState().settings, boardSize: Number(input.value) as BoardSize } });
      updatePreview();
    });
  });
}

/** Wires up the start button to launch the game with the current settings. */
function bindStartButton(): void {
  document.getElementById('settings-start-btn')?.addEventListener('click', () => {
    setState({
      screen: 'game',
      currentPlayer: getState().settings.player,
      scores: { blue: 0, orange: 0 },
    });
    render();
  });
}

/** Attaches event listeners for the settings screen. */
export function initSettings(): void {
  bindThemeInputs();
  bindPlayerInputs();
  bindBoardSizeInputs();
  bindStartButton();
}
