import { getState, setState } from '../state/game-state';
import { getTheme, type ThemeConfig, type ThemeModalConfig } from '../data/themes';
import { render } from '../main';
import { renderCurrentPlayerMarker, renderScoresBox } from '../components/score-box';
import type { Card, CardIcon, PlayerColor, ThemeName, BoardSize } from '../types/index';

/** Grid columns per board size; card size and gaps live in CSS so themes can override them. */
const GRID_COLS: Record<BoardSize, number> = { 16: 4, 24: 6, 36: 6 };
const EXIT_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-exit.svg`;
const MATCH_TO_GAMEOVER_DELAY_MS = 600;
const MISMATCH_FLIP_BACK_DELAY_MS = 1000;

/**
 * Returns the other player's color.
 * @param current - The player whose turn just ended.
 * @returns The color of the next player to move.
 */
function nextPlayer(current: PlayerColor): PlayerColor {
  return current === 'blue' ? 'orange' : 'blue';
}

/**
 * Returns the current-player indicator shown between the two score boxes.
 * @param currentPlayer - The player whose turn it currently is.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the current-player indicator.
 */
function renderCurrentPlayerIndicator(currentPlayer: PlayerColor, theme: ThemeConfig): string {
  return `
    <p class="scorebar__current" style="color:${theme.textColor}">
      Current player:
      ${renderCurrentPlayerMarker(currentPlayer, theme.scoreBox.layout)}
    </p>
  `;
}

/**
 * Returns the exit-game button shown on the right of the score bar.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the exit-game button.
 */
function renderExitButton(theme: ThemeConfig): string {
  const { bg, border, text = theme.textColor } = theme.exitBtn;
  return `
    <button class="scorebar__exit-btn" id="exit-game-btn" style="--exit-bg:${bg};--exit-border:${border};color:${text};--exit-hover-color:${theme.exitBtnHoverColor}">
      <span class="scorebar__exit-icon" style="--mask-src:url('${EXIT_ICON_PATH}')" aria-hidden="true"></span>
      Exit game
    </button>
  `;
}

/**
 * Returns the HTML for the score and player header bar.
 * @param scores - The current score for each player.
 * @param currentPlayer - The player whose turn it currently is.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the `<header>` score bar.
 */
function renderScorebar(scores: Record<PlayerColor, number>, currentPlayer: PlayerColor, theme: ThemeConfig): string {
  return `
    <header class="scorebar" style="background:${theme.scoreBarBg}">
      ${renderScoresBox(scores, theme.scoreBox)}
      ${renderCurrentPlayerIndicator(currentPlayer, theme)}
      ${renderExitButton(theme)}
    </header>
  `;
}

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * @param array - The array to shuffle.
 * @returns The same array, shuffled in place.
 */
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Creates and shuffles all card pairs for the given board size and theme.
 * @param boardSize - The total number of cards on the board.
 * @param theme - The active theme's visual configuration.
 * @returns The shuffled list of cards.
 */
function buildCards(boardSize: number, theme: ThemeConfig): Card[] {
  const pairCount = boardSize / 2;
  const iconPool  = theme.icons.slice(0, pairCount);

  const pairs: Card[] = iconPool.flatMap((icon, pairId) => [
    { id: pairId * 2,     pairId, icon, isFlipped: false, isMatched: false },
    { id: pairId * 2 + 1, pairId, icon, isFlipped: false, isMatched: false },
  ]);

  return shuffle(pairs);
}

/**
 * Ensures cards exist in state for the given board size and theme (builds them once).
 * @param boardSize - The total number of cards on the board.
 * @param theme - The active theme's visual configuration.
 */
function ensureCards(boardSize: number, theme: ThemeConfig): void {
  if (getState().cards.length === 0) {
    setState({ cards: buildCards(boardSize, theme) });
  }
}

/**
 * Returns the HTML for a card icon (badge, emoji or image).
 * @param icon - The icon to render.
 * @returns HTML markup for the icon.
 */
function renderIcon(icon: CardIcon): string {
  if (icon.type === 'badge') {
    return `<span class="card__badge" style="background:${icon.badgeBg};color:${icon.badgeColor}">${icon.value}</span>`;
  }
  if (icon.type === 'image') {
    return `<img class="card__image" src="${icon.value}" alt="" />`;
  }
  return `<span class="card__emoji">${icon.value}</span>`;
}

/**
 * Returns the HTML for a single memory card.
 * @param card - The card's current state.
 * @param index - The card's position in the board array.
 * @param backIcon - The URL of the theme's card-back image.
 * @returns HTML markup for the card button.
 */
function renderCard(card: Card, index: number, backIcon: string): string {
  const stateClasses = `${card.isFlipped || card.isMatched ? 'is-flipped' : ''} ${card.isMatched ? 'is-matched' : ''}`;
  const disabledAttr = card.isMatched ? 'disabled' : '';
  return `
    <button class="card ${stateClasses}" data-index="${index}" aria-label="Memory card" ${disabledAttr}>
      <div class="card__inner">
        <div class="card__face card__face--hidden"><img class="card__back-image" src="${backIcon}" alt="" /></div>
        <div class="card__face card__face--revealed">${renderIcon(card.icon)}</div>
      </div>
    </button>
  `;
}

/**
 * Returns the HTML for the card grid. The grid's CSS shrinks the cards below their
 * max size when the board would otherwise overflow the available width or height.
 * @param cards - The full list of cards on the board.
 * @param boardSize - The number of cards on the board.
 * @param backIcon - The URL of the theme's card-back image.
 * @returns HTML markup for the card grid `<section>`.
 */
function renderField(cards: Card[], boardSize: BoardSize, backIcon: string): string {
  const cardsHtml = cards.map((card, i) => renderCard(card, i, backIcon)).join('');
  const cols = GRID_COLS[boardSize];
  const rows = Math.ceil(cards.length / cols);
  return `
    <section class="field" id="field" aria-label="Game board">
      <div class="field__grid" data-size="${boardSize}" style="--cols:${cols}; --rows:${rows}">
        ${cardsHtml}
      </div>
    </section>
  `;
}

/**
 * Returns an inline `style` value for one exit-modal button.
 * @param bg - Background color.
 * @param border - Border shorthand.
 * @param color - Text color.
 * @param shadow - Box-shadow shorthand for the resting state.
 * @param hoverColor - Glow color on hover.
 * @returns A CSS declaration string for the `style` attribute.
 */
function modalButtonStyle(bg: string, border: string, color: string, shadow: string, hoverColor: string): string {
  return `background:${bg}; border:${border}; color:${color}; --modal-btn-shadow:${shadow}; --modal-btn-hover:${hoverColor}`;
}

/**
 * Returns the HTML for the exit-modal's back/exit action buttons.
 * @param modal - The theme's modal configuration (labels).
 * @param backStyle - The `style` value for the back-to-game button.
 * @param exitStyle - The `style` value for the quit button.
 * @returns HTML markup for the modal's actions.
 */
function renderModalActions(modal: ThemeModalConfig, backStyle: string, exitStyle: string): string {
  return `
    <div class="modal__actions">
      <button class="modal__btn modal__btn--back" id="modal-back-btn" style="${backStyle}">${modal.backLabel}</button>
      <button class="modal__btn" id="modal-exit-btn" style="${exitStyle}">${modal.exitLabel}</button>
    </div>
  `;
}

/**
 * Returns the HTML for the exit confirmation modal, themed to match the active game theme.
 * @param theme - The active theme's visual configuration.
 * @returns HTML markup for the exit-confirmation modal.
 */
function renderExitModal(theme: ThemeConfig): string {
  const { modal } = theme;
  const hover = theme.exitBtnHoverColor;
  const backStyle = modalButtonStyle(modal.backBg, modal.backBorder, modal.backText, modal.backShadow, hover);
  const exitStyle = modalButtonStyle(modal.exitBg, modal.exitBorder, modal.exitText, modal.exitShadow, hover);
  return `
    <div class="modal modal--from-${modal.enterFrom}" id="exit-modal" data-animate-close="${modal.animateClose}" role="dialog" aria-modal="true" aria-labelledby="modal-heading" hidden>
      <div class="modal__box" style="background:${modal.boxBg}">
        <p class="modal__text" id="modal-heading" style="color:${modal.headingColor}">Are you sure you want to quit the game?</p>
        ${renderModalActions(modal, backStyle, exitStyle)}
      </div>
    </div>
  `;
}

/**
 * Resolves the confirmed settings into the active theme and board size.
 * @returns The active theme key, its visual configuration, and the board size.
 */
function resolveGameSetup(): { themeKey: ThemeName; theme: ThemeConfig; boardSize: BoardSize } {
  const { settings } = getState();
  const themeKey  = settings.theme as ThemeName;
  const boardSize = settings.boardSize as BoardSize;
  const theme     = getTheme(themeKey);
  return { themeKey, theme, boardSize };
}

/**
 * Returns the full HTML markup for the game screen.
 * @returns HTML markup for the `<main>` game screen element.
 */
export function renderGame(): string {
  const { themeKey, theme, boardSize } = resolveGameSetup();
  ensureCards(boardSize, theme);
  const { cards, scores, currentPlayer } = getState();
  return `
    <main class="game" data-theme="${themeKey}" style="background:${theme.bgColor}">
      <h1 class="visually-hidden">Memory game board</h1>
      ${renderScorebar(scores, currentPlayer, theme)}
      ${renderField(cards, boardSize, theme.backIcon)}
      ${renderExitModal(theme)}
    </main>
  `;
}

/**
 * Updates a single card element in the DOM to reflect its current state.
 * @param index - The card's position in the board array.
 * @param card - The card's current state.
 */
function updateCardEl(index: number, card: Card): void {
  const el = document.querySelector<HTMLButtonElement>(`.card[data-index="${index}"]`);
  if (!el) return;
  el.classList.toggle('is-flipped', card.isFlipped || card.isMatched);
  el.classList.toggle('is-matched', card.isMatched);
  if (card.isMatched) el.disabled = true;
}

/** Re-renders the scorebar's score box and current-player marker in the DOM for the active theme. */
function updateScorebar(): void {
  const state = getState();
  const theme = getTheme(state.settings.theme as ThemeName);
  const boxEl = document.querySelector('.scorebar .score-box');
  const curEl = document.querySelector('.scorebar__current');

  if (boxEl) boxEl.outerHTML = renderScoresBox(state.scores, theme.scoreBox);
  if (curEl) {
    curEl.innerHTML = `Current player: ${renderCurrentPlayerMarker(state.currentPlayer, theme.scoreBox.layout)}`;
  }
}

/**
 * Ends the game once every card has been matched.
 * @param cards - The full list of cards on the board.
 */
function maybeEndGame(cards: Card[]): void {
  if (!cards.every(c => c.isMatched)) return;
  setTimeout(() => { setState({ screen: 'gameover' }); render(); }, MATCH_TO_GAMEOVER_DELAY_MS);
}

/**
 * Handles a successful pair match: updates state, DOM, and checks for game over.
 * @param a - The index of the first matched card.
 * @param b - The index of the second matched card.
 */
function handleMatch(a: number, b: number): void {
  const state  = getState();
  const cards  = [...state.cards];
  const scores = { ...state.scores };

  cards[a] = { ...cards[a], isMatched: true };
  cards[b] = { ...cards[b], isMatched: true };
  scores[state.currentPlayer]++;

  setState({ cards, scores, flippedIndexes: [], isLocked: false });
  updateCardEl(a, cards[a]);
  updateCardEl(b, cards[b]);
  updateScorebar();
  maybeEndGame(cards);
}

/**
 * Handles a failed match: flips both cards back and switches the active player.
 * @param a - The index of the first flipped card.
 * @param b - The index of the second flipped card.
 */
function handleNoMatch(a: number, b: number): void {
  setTimeout(() => {
    const state = getState();
    const cards = [...state.cards];
    cards[a] = { ...cards[a], isFlipped: false };
    cards[b] = { ...cards[b], isFlipped: false };

    setState({ cards, flippedIndexes: [], isLocked: false, currentPlayer: nextPlayer(state.currentPlayer) });
    updateCardEl(a, cards[a]);
    updateCardEl(b, cards[b]);
    updateScorebar();
  }, MISMATCH_FLIP_BACK_DELAY_MS);
}

/**
 * Checks if two flipped cards match and delegates to the appropriate handler.
 * @param a - The index of the first flipped card.
 * @param b - The index of the second flipped card.
 */
function checkMatch(a: number, b: number): void {
  const { cards } = getState();
  const isMatch   = cards[a].pairId === cards[b].pairId;
  if (isMatch) handleMatch(a, b);
  else         handleNoMatch(a, b);
}

/**
 * Flips the card at the given index and triggers a match check after the second flip.
 * @param index - The index of the card to flip.
 */
function flipCard(index: number): void {
  const state          = getState();
  const cards          = [...state.cards];
  cards[index]         = { ...cards[index], isFlipped: true };
  const flippedIndexes = [...state.flippedIndexes, index];

  setState({ cards, flippedIndexes });
  updateCardEl(index, cards[index]);

  if (flippedIndexes.length === 2) {
    setState({ isLocked: true });
    checkMatch(flippedIndexes[0], flippedIndexes[1]);
  }
}

/**
 * Hides the exit-confirmation modal, sliding it out first if the theme animates the close.
 * @param modal - The modal's root element.
 */
function closeExitModal(modal: HTMLElement): void {
  if (modal.dataset.animateClose !== 'true') {
    modal.hidden = true;
    return;
  }
  modal.classList.add('is-closing');
  modal.addEventListener('animationend', () => {
    modal.classList.remove('is-closing');
    modal.hidden = true;
  }, { once: true });
}

/**
 * Wires up the exit-confirmation modal's open/close/confirm buttons.
 * @param modal - The modal's root element.
 */
function bindExitModal(modal: HTMLElement): void {
  document.getElementById('exit-game-btn')?.addEventListener('click', () => {
    modal.hidden = false;
  });
  document.getElementById('modal-back-btn')?.addEventListener('click', () => {
    closeExitModal(modal);
  });
  document.getElementById('modal-exit-btn')?.addEventListener('click', () => {
    setState({ screen: 'settings', cards: [], flippedIndexes: [], scores: { blue: 0, orange: 0 } });
    render();
  });
}

/** Wires up click-to-flip delegation on the card grid. */
function bindFieldClicks(): void {
  document.getElementById('field')?.addEventListener('click', (e) => {
    if (getState().isLocked) return;
    const cardEl = (e.target as HTMLElement).closest<HTMLButtonElement>('.card');
    if (!cardEl || cardEl.disabled) return;

    const index = Number(cardEl.dataset['index']);
    const card  = getState().cards[index];
    if (!card.isFlipped && !card.isMatched) flipCard(index);
  });
}

/** Attaches event listeners for the game screen. */
export function initGame(): void {
  const exitModal = document.getElementById('exit-modal') as HTMLElement;
  bindExitModal(exitModal);
  bindFieldClicks();
}
