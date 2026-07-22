import { getState, setState } from '../state/game-state';
import { getTheme, type ThemeConfig } from '../data/themes';
import { render } from '../main';
import type { Card, CardIcon, PlayerColor } from '../types/index';

const GRID_COLS: Record<number, number> = { 16: 4, 24: 6, 36: 6 };
const SCORE_TAG_PATH = `${import.meta.env.BASE_URL}ui/label.svg`;
const EXIT_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-exit.svg`;
const MATCH_TO_GAMEOVER_DELAY_MS = 600;
const MISMATCH_FLIP_BACK_DELAY_MS = 1000;

/** Returns the other player's color. */
function nextPlayer(current: PlayerColor): PlayerColor {
  return current === 'blue' ? 'orange' : 'blue';
}

/** Returns the mask-colored tag icon used next to player scores. */
function renderScoreTag(player: PlayerColor): string {
  return `<span class="scorebar__tag scorebar__tag--${player}" style="--mask-src:url('${SCORE_TAG_PATH}')" aria-hidden="true"></span>`;
}

/** Returns a single player's score entry (colored tag + colored label) for the shared score box. */
function renderScoreEntry(player: PlayerColor, label: string, score: number): string {
  return `
    <div class="scorebar__score-entry">
      ${renderScoreTag(player)}
      <span class="scorebar__score-text scorebar__score-text--${player}">${label} ${score}</span>
    </div>
  `;
}

/** Returns the shared blue/orange score box. */
function renderScoresBox(scores: Record<PlayerColor, number>, bg: string): string {
  return `
    <div class="scorebar__scores" style="background:${bg}">
      ${renderScoreEntry('blue', 'Blue', scores.blue)}
      ${renderScoreEntry('orange', 'Orange', scores.orange)}
    </div>
  `;
}

/** Returns the current-player indicator shown between the two score boxes. */
function renderCurrentPlayerIndicator(currentPlayer: PlayerColor, textColor: string): string {
  return `
    <p class="scorebar__current" style="color:${textColor}">
      Current player:
      ${renderScoreTag(currentPlayer)}
    </p>
  `;
}

/** Returns the exit-game button shown on the right of the score bar. */
function renderExitButton(borderColor: string, textColor: string): string {
  return `
    <button class="scorebar__exit-btn" id="exit-game-btn" style="border-color:${borderColor};color:${textColor}">
      <span class="scorebar__exit-icon" style="--mask-src:url('${EXIT_ICON_PATH}')" aria-hidden="true"></span>
      Exit game
    </button>
  `;
}

/** Returns the HTML for the score and player header bar. */
function renderScorebar(scores: Record<PlayerColor, number>, currentPlayer: PlayerColor, theme: ThemeConfig): string {
  return `
    <header class="scorebar" style="background:${theme.scoreBarBg}">
      ${renderScoresBox(scores, theme.exitBtnBorder)}
      ${renderCurrentPlayerIndicator(currentPlayer, theme.textColor)}
      ${renderExitButton(theme.exitBtnBorder, theme.textColor)}
    </header>
  `;
}

/** Shuffles an array in-place using the Fisher-Yates algorithm. */
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** Creates and shuffles all card pairs for the given board size and theme. */
function buildCards(boardSize: number, theme: ThemeConfig): Card[] {
  const pairCount = boardSize / 2;
  const iconPool  = theme.icons.slice(0, pairCount);

  const pairs: Card[] = iconPool.flatMap((icon, pairId) => [
    { id: pairId * 2,     pairId, icon, isFlipped: false, isMatched: false },
    { id: pairId * 2 + 1, pairId, icon, isFlipped: false, isMatched: false },
  ]);

  return shuffle(pairs);
}

/** Ensures cards exist in state for the given board size and theme (builds them once). */
function ensureCards(boardSize: number, theme: ThemeConfig): void {
  if (getState().cards.length === 0) {
    setState({ cards: buildCards(boardSize, theme) });
  }
}

/** Returns the HTML for a card icon (badge, emoji or image). */
function renderIcon(icon: CardIcon): string {
  if (icon.type === 'badge') {
    return `<span class="card__badge" style="background:${icon.badgeBg};color:${icon.badgeColor}">${icon.value}</span>`;
  }
  if (icon.type === 'image') {
    return `<img class="card__image" src="${icon.value}" alt="" />`;
  }
  return `<span class="card__emoji">${icon.value}</span>`;
}

/** Returns the HTML for a single memory card. */
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

/** Returns the HTML for the card grid. */
function renderField(cards: Card[], cols: number, backIcon: string): string {
  const cardsHtml = cards.map((card, i) => renderCard(card, i, backIcon)).join('');
  return `
    <section class="field" id="field" aria-label="Game board" style="grid-template-columns: repeat(${cols}, 1fr)">
      ${cardsHtml}
    </section>
  `;
}

/** Returns the HTML for the exit confirmation modal. */
function renderExitModal(): string {
  return `
    <div class="modal" id="exit-modal" role="dialog" aria-modal="true" aria-labelledby="modal-heading" hidden>
      <div class="modal__box">
        <p class="modal__text" id="modal-heading">Are you sure you want to quit the game?</p>
        <div class="modal__actions">
          <button class="btn btn--secondary" id="modal-back-btn">Back to game</button>
          <button class="btn btn--danger"    id="modal-exit-btn">Exit game</button>
        </div>
      </div>
    </div>
  `;
}

/** Returns the full HTML markup for the game screen. */
export function renderGame(): string {
  const state = getState();
  const theme = getTheme(state.settings.theme);
  ensureCards(state.settings.boardSize, theme);
  const { cards, scores, currentPlayer } = getState();
  const cols = GRID_COLS[state.settings.boardSize];
  return `
    <main class="game" data-theme="${state.settings.theme}" style="background:${theme.bgColor}">
      <h1 class="visually-hidden">Memory game board</h1>
      ${renderScorebar(scores, currentPlayer, theme)}
      ${renderField(cards, cols, theme.backIcon)}
      ${renderExitModal()}
    </main>
  `;
}

/** Updates a single card element in the DOM to reflect its current state. */
function updateCardEl(index: number, card: Card): void {
  const el = document.querySelector<HTMLButtonElement>(`.card[data-index="${index}"]`);
  if (!el) return;
  el.classList.toggle('is-flipped', card.isFlipped || card.isMatched);
  el.classList.toggle('is-matched', card.isMatched);
  if (card.isMatched) el.disabled = true;
}

/** Refreshes the scorebar text and current-player indicator in the DOM. */
function updateScorebar(): void {
  const state    = getState();
  const blueEl   = document.querySelector('.scorebar__score-text--blue');
  const orangeEl = document.querySelector('.scorebar__score-text--orange');
  const curEl    = document.querySelector('.scorebar__current');

  if (blueEl)   blueEl.textContent   = `Blue ${state.scores.blue}`;
  if (orangeEl) orangeEl.textContent = `Orange ${state.scores.orange}`;
  if (curEl) {
    curEl.innerHTML = `Current player: ${renderScoreTag(state.currentPlayer)}`;
  }
}

/** Ends the game once every card has been matched. */
function maybeEndGame(cards: Card[]): void {
  if (!cards.every(c => c.isMatched)) return;
  setTimeout(() => { setState({ screen: 'gameover' }); render(); }, MATCH_TO_GAMEOVER_DELAY_MS);
}

/** Handles a successful pair match: updates state, DOM, and checks for game over. */
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
  maybeEndGame(cards);
}

/** Handles a failed match: flips both cards back and switches the active player. */
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

/** Checks if two flipped cards match and delegates to the appropriate handler. */
function checkMatch(a: number, b: number): void {
  const { cards } = getState();
  const isMatch   = cards[a].pairId === cards[b].pairId;
  if (isMatch) handleMatch(a, b);
  else         handleNoMatch(a, b);
}

/** Flips the card at the given index and triggers a match check after the second flip. */
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

/** Wires up the exit-confirmation modal's open/close/confirm buttons. */
function bindExitModal(modal: HTMLElement): void {
  document.getElementById('exit-game-btn')?.addEventListener('click', () => {
    modal.hidden = false;
  });
  document.getElementById('modal-back-btn')?.addEventListener('click', () => {
    modal.hidden = true;
  });
  document.getElementById('modal-exit-btn')?.addEventListener('click', () => {
    setState({ screen: 'home', cards: [], flippedIndexes: [], scores: { blue: 0, orange: 0 } });
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
