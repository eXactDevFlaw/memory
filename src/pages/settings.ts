import { getState, setState } from '../state/game-state';
import { getThemePreviewHtml, THEMES } from '../data/themes';
import { render } from '../main';
import type { ThemeName, PlayerColor, BoardSize, GameSettings } from '../types/index';

const ICON_THEME_PATH     = `${import.meta.env.BASE_URL}ui/icon-theme.svg`;
const ICON_PLAYER_PATH    = `${import.meta.env.BASE_URL}ui/icon-player.svg`;
const ICON_BOARDSIZE_PATH = `${import.meta.env.BASE_URL}ui/icon-boardsize.svg`;

const START_BTN_ACTIVE_PATH   = `${import.meta.env.BASE_URL}ui/play-btn-active.svg`;
const START_BTN_DISABLED_PATH = `${import.meta.env.BASE_URL}ui/play-btn-disabled.svg`;

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
  current: T | null,
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
  current: T | null,
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
  current: T | null,
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
 * Returns the theme-preview illustration and the selection bar, stacked.
 * @param settings - The currently selected game settings.
 * @returns HTML markup for the preview column.
 */
function renderPreviewColumn(settings: GameSettings): string {
  return `
    <div class="settings__preview-column">
      <aside class="settings__preview-area" id="settings-preview">
        ${settings.theme ? getThemePreviewHtml(settings.theme) : ''}
      </aside>
      ${renderBar(settings)}
    </div>
  `;
}

/**
 * Returns the form and the preview column side by side.
 * @param settings - The currently selected game settings.
 * @returns HTML markup for the settings body layout.
 */
function renderBody(settings: GameSettings): string {
  return `
    <div class="settings__body">
      ${renderForm(settings)}
      ${renderPreviewColumn(settings)}
    </div>
  `;
}

/**
 * Returns one breadcrumb step's label and pending/filled state.
 * @param value - The chosen value, or `null` if not yet picked.
 * @param placeholder - The generic label to show while unpicked.
 * @param format - Formats a chosen value into its display label.
 * @returns The step's `{ label, pending }` pair.
 */
function barStepState<T>(value: T | null, placeholder: string, format: (value: T) => string): { label: string; pending: boolean } {
  return value === null ? { label: placeholder, pending: true } : { label: format(value), pending: false };
}

function renderBarStep(id: string, value: string | null, placeholder: string, format: (value: string) => string): string {
  const { label, pending } = barStepState(value, placeholder, format);
  return `<li class="settings__bar-step${pending ? ' settings__bar-step--pending' : ''}" id="${id}">${label}</li>`;
}

/**
 * Returns the step indicators shown in the bottom status bar.
 * @param settings - The currently selected game settings.
 * @returns HTML markup for the breadcrumb-style step list.
 */
function renderBarSteps(settings: GameSettings): string {
  return `
    <nav aria-label="Settings progress">
      <ol class="settings__bar-steps">
        ${renderBarStep('bar-theme', settings.theme, 'Game theme', value => THEMES[value as ThemeName].name)}
        ${renderBarStep('bar-player', settings.player, 'Player', value => value === 'blue' ? 'Blue Player' : 'Orange Player')}
        ${renderBarStep('bar-size', settings.boardSize === null ? null : String(settings.boardSize), 'Board size', value => `Board-${value} Cards`)}
      </ol>
    </nav>
  `;
}

/**
 * Reports whether every setting has been picked, i.e. the game can be started.
 * @param settings - The currently selected game settings.
 * @returns `true` once theme, player, and board size are all non-null.
 */
function isComplete(settings: GameSettings): boolean {
  return settings.theme !== null && settings.player !== null && settings.boardSize !== null;
}

/**
 * Returns the bottom status bar showing current selections.
 * @param settings - The currently selected game settings.
 * @returns HTML markup for the bottom bar, including the Start button.
 */
function renderBar(settings: GameSettings): string {
  const canStart = isComplete(settings);
  return `
    <div class="settings__bar">
      ${renderBarSteps(settings)}
      <button class="btn--start" id="settings-start-btn" aria-label="Start the game" ${canStart ? '' : 'disabled'}>
        <img id="settings-start-icon" src="${canStart ? START_BTN_ACTIVE_PATH : START_BTN_DISABLED_PATH}" alt="" />
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
      </div>
    </main>
  `;
}

/**
 * Applies a breadcrumb step's pending/filled state and label to its `<li>`.
 * @param el - The step element, or `null` if not yet mounted.
 */
function applyBarStep(el: HTMLElement | null, value: string | null, placeholder: string, format: (value: string) => string): void {
  if (!el) return;
  const { label, pending } = barStepState(value, placeholder, format);
  el.textContent = label;
  el.classList.toggle('settings__bar-step--pending', pending);
}

/** Updates the settings bar labels, theme preview, and Start button to reflect current state. */
function updatePreview(): void {
  const { settings } = getState();
  const preview   = document.getElementById('settings-preview');
  const startBtn  = document.getElementById('settings-start-btn') as HTMLButtonElement | null;
  const startIcon = document.getElementById('settings-start-icon') as HTMLImageElement | null;
  const canStart  = isComplete(settings);

  if (preview) preview.innerHTML = settings.theme ? getThemePreviewHtml(settings.theme) : '';
  applyBarStep(document.getElementById('bar-theme'), settings.theme, 'Game theme', value => THEMES[value as ThemeName].name);
  applyBarStep(document.getElementById('bar-player'), settings.player, 'Player', value => value === 'blue' ? 'Blue Player' : 'Orange Player');
  applyBarStep(document.getElementById('bar-size'), settings.boardSize === null ? null : String(settings.boardSize), 'Board size', value => `Board-${value} Cards`);
  if (startBtn)  startBtn.disabled = !canStart;
  if (startIcon) startIcon.src = canStart ? START_BTN_ACTIVE_PATH : START_BTN_DISABLED_PATH;
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
    const { settings } = getState();
    if (!isComplete(settings)) return;
    setState({
      screen: 'game',
      currentPlayer: settings.player as PlayerColor,
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
