import { getState, setState } from '../state/gameState';
import { getThemePreviewHtml, themes } from '../data/themes';
import { render } from '../main';
import type { ThemeName, PlayerColor, BoardSize } from '../types/index';

export function renderSettings(): string {
  const { settings } = getState();

  const themeOptions: { value: ThemeName; label: string }[] = [
    { value: 'code-vibes',   label: 'Code vibes theme' },
    { value: 'gaming',       label: 'Gaming theme' },
    { value: 'da-projects',  label: 'DA Projects theme' },
    { value: 'food',         label: 'Foods theme' },
  ];

  const playerOptions: { value: PlayerColor; label: string }[] = [
    { value: 'blue',   label: 'Blue' },
    { value: 'orange', label: 'Orange' },
  ];

  const sizeOptions: { value: BoardSize; label: string }[] = [
    { value: 16, label: '16 cards' },
    { value: 24, label: '24 cards' },
    { value: 36, label: '36 cards' },
  ];

  const themeRadios = themeOptions.map(opt => `
    <label class="settings__radio-label">
      <input
        type="radio"
        name="theme"
        value="${opt.value}"
        class="settings__radio-input"
        ${settings.theme === opt.value ? 'checked' : ''}
      >
      <span class="settings__radio-custom"></span>
      ${opt.label}
    </label>
  `).join('');

  const playerRadios = playerOptions.map(opt => `
    <label class="settings__radio-label">
      <input
        type="radio"
        name="player"
        value="${opt.value}"
        class="settings__radio-input"
        ${settings.player === opt.value ? 'checked' : ''}
      >
      <span class="settings__radio-custom"></span>
      ${opt.label}
    </label>
  `).join('');

  const sizeRadios = sizeOptions.map(opt => `
    <label class="settings__radio-label">
      <input
        type="radio"
        name="boardSize"
        value="${opt.value}"
        class="settings__radio-input"
        ${settings.boardSize === opt.value ? 'checked' : ''}
      >
      <span class="settings__radio-custom"></span>
      ${opt.label}
    </label>
  `).join('');

  return `
    <div class="settings">
      <h1 class="settings__title">Settings</h1>

      <div class="settings__body">
        <div class="settings__form">
          <fieldset class="settings__group">
            <legend class="settings__group-legend">
              <span class="settings__group-icon">🎮</span>
              Game themes
            </legend>
            ${themeRadios}
          </fieldset>

          <fieldset class="settings__group">
            <legend class="settings__group-legend">
              <span class="settings__group-icon">👤</span>
              Choose player
            </legend>
            ${playerRadios}
          </fieldset>

          <fieldset class="settings__group">
            <legend class="settings__group-legend">
              <span class="settings__group-icon">🔲</span>
              Board size
            </legend>
            ${sizeRadios}
          </fieldset>
        </div>

        <div class="settings__preview-area" id="settings-preview">
          ${getThemePreviewHtml(settings.theme)}
        </div>
      </div>

      <div class="settings__bar">
        <div class="settings__bar-steps">
          <span class="settings__bar-step" id="bar-theme">${themes[settings.theme].name}</span>
          <span class="settings__bar-sep">/</span>
          <span class="settings__bar-step" id="bar-player">${settings.player === 'blue' ? 'Blue' : 'Orange'} Player</span>
          <span class="settings__bar-sep">/</span>
          <span class="settings__bar-step" id="bar-size">${settings.boardSize} Cards</span>
        </div>
        <button class="btn btn--start" id="settings-start-btn">
          <span>▶</span> Start
        </button>
      </div>
    </div>
  `;
}

export function initSettings(): void {
  const previewArea = document.getElementById('settings-preview');
  const barTheme    = document.getElementById('bar-theme');
  const barPlayer   = document.getElementById('bar-player');
  const barSize     = document.getElementById('bar-size');

  function updatePreview(): void {
    const { settings } = getState();
    if (previewArea) previewArea.innerHTML = getThemePreviewHtml(settings.theme);
    if (barTheme)  barTheme.textContent  = themes[settings.theme].name;
    if (barPlayer) barPlayer.textContent = settings.player === 'blue' ? 'Blue Player' : 'Orange Player';
    if (barSize)   barSize.textContent   = `${settings.boardSize} Cards`;
  }

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
