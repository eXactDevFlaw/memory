import { getState, setState } from '../state/game-state';
import { getTheme } from '../data/themes';
import { render } from '../main';
import type { Card, CardIcon } from '../types/index';

const GRID_COLS: Record<number, number> = { 16: 4, 24: 6, 36: 6 };

/** Shuffles an array in-place using the Fisher-Yates algorithm. */
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** Creates and shuffles all card pairs for the given board size and theme. */
function buildCards(boardSize: number, theme: ReturnType<typeof getTheme>): Card[] {
  const pairCount = boardSize / 2;
  const iconPool  = theme.icons.slice(0, pairCount);

  const pairs: Card[] = iconPool.flatMap((icon, pairId) => [
    { id: pairId * 2,     pairId, icon, isFlipped: false, isMatched: false },
    { id: pairId * 2 + 1, pairId, icon, isFlipped: false, isMatched: false },
  ]);

  return shuffle(pairs);
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
  const flippedClass = card.isFlipped || card.isMatched ? 'is-flipped' : '';
  const matchedClass = card.isMatched ? 'is-matched' : '';
  return `
    <button
      class="card ${flippedClass} ${matchedClass}"
      data-index="${index}"
      aria-label="Memory card"
      ${card.isMatched ? 'disabled' : ''}
    >
      <div class="card__inner">
        <div class="card__face card__face--hidden">
          <img class="card__back-image" src="${backIcon}" alt="" />
        </div>
        <div class="card__face card__face--revealed">
          ${renderIcon(card.icon)}
        </div>
      </div>
    </button>
  `;
}

/** Returns the HTML for the score and player header bar. */
function renderScorebar(
  scores: Record<'blue' | 'orange', number>,
  currentPlayer: 'blue' | 'orange',
  theme: ReturnType<typeof getTheme>,
): string {
  return `
    <header class="scorebar" style="background:${theme.scoreBarBg}">
      <div class="scorebar__scores">
        <span class="scorebar__dot scorebar__dot--blue"></span>
        <span class="scorebar__score scorebar__score--blue" style="color:${theme.textColor}">Blue ${scores.blue}</span>
        <span class="scorebar__dot scorebar__dot--orange"></span>
        <span class="scorebar__score scorebar__score--orange" style="color:${theme.textColor}">Orange ${scores.orange}</span>
      </div>
      <p class="scorebar__current" style="color:${theme.textColor}">
        Current player:
        <span class="scorebar__dot scorebar__dot--${currentPlayer}"></span>
      </p>
      <button class="scorebar__exit-btn" id="exit-game-btn" style="border-color:${theme.exitBtnBorder};color:${theme.textColor}">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
        Exit game
      </button>
    </header>
  `;
}

/** Returns the HTML for the card grid. */
function renderField(cards: Card[], cols: number, backIcon: string): string {
  const cardsHtml = cards.map((card, i) => renderCard(card, i, backIcon)).join('');
  return `
    <section
      class="field"
      id="field"
      aria-label="Game board"
      style="grid-template-columns: repeat(${cols}, 1fr)"
    >
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
  const cols  = GRID_COLS[state.settings.boardSize];

  if (state.cards.length === 0) {
    setState({ cards: buildCards(state.settings.boardSize, theme) });
  }

  const { cards, scores, currentPlayer } = getState();
  return `
    <div class="game" data-theme="${state.settings.theme}" style="background:${theme.bgColor}">
      ${renderScorebar(scores, currentPlayer, theme)}
      ${renderField(cards, cols, theme.backIcon)}
      ${renderExitModal()}
    </div>
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
  const blueEl   = document.querySelector('.scorebar__score--blue');
  const orangeEl = document.querySelector('.scorebar__score--orange');
  const curEl    = document.querySelector('.scorebar__current');

  if (blueEl)   blueEl.textContent   = `Blue ${state.scores.blue}`;
  if (orangeEl) orangeEl.textContent = `Orange ${state.scores.orange}`;
  if (curEl) {
    curEl.innerHTML = `Current player: <span class="scorebar__dot scorebar__dot--${state.currentPlayer}"></span>`;
  }
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

  if (cards.every(c => c.isMatched)) {
    setTimeout(() => { setState({ screen: 'gameover' }); render(); }, 600);
  }
}

/** Handles a failed match: flips both cards back and switches the active player. */
function handleNoMatch(a: number, b: number): void {
  setTimeout(() => {
    const state   = getState();
    const cards   = [...state.cards];
    const next    = state.currentPlayer === 'blue' ? 'orange' : 'blue';

    cards[a] = { ...cards[a], isFlipped: false };
    cards[b] = { ...cards[b], isFlipped: false };

    setState({ cards, flippedIndexes: [], isLocked: false, currentPlayer: next });
    updateCardEl(a, cards[a]);
    updateCardEl(b, cards[b]);
    updateScorebar();
  }, 1000);
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

/** Attaches event listeners for the game screen. */
export function initGame(): void {
  const exitModal = document.getElementById('exit-modal') as HTMLElement;

  document.getElementById('exit-game-btn')?.addEventListener('click', () => {
    exitModal.hidden = false;
  });

  document.getElementById('modal-back-btn')?.addEventListener('click', () => {
    exitModal.hidden = true;
  });

  document.getElementById('modal-exit-btn')?.addEventListener('click', () => {
    setState({ screen: 'home', cards: [], flippedIndexes: [], scores: { blue: 0, orange: 0 } });
    render();
  });

  document.getElementById('field')?.addEventListener('click', (e) => {
    if (getState().isLocked) return;
    const cardEl = (e.target as HTMLElement).closest<HTMLButtonElement>('.card');
    if (!cardEl || cardEl.disabled) return;

    const index = Number(cardEl.dataset['index']);
    const card  = getState().cards[index];
    if (!card.isFlipped && !card.isMatched) flipCard(index);
  });
}
