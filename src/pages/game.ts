import { getState, setState } from '../state/gameState';
import { getTheme } from '../data/themes';
import { render } from '../main';
import type { Card, CardIcon } from '../types/index';

const GRID_COLS: Record<number, number> = { 16: 4, 24: 6, 36: 6 };

function buildCards(boardSize: number, theme: ReturnType<typeof getTheme>): Card[] {
  const pairCount = boardSize / 2;
  const iconPool  = theme.icons.slice(0, pairCount);

  const pairs: Card[] = iconPool.flatMap((icon, pairId) => [
    { id: pairId * 2,     pairId, icon, isFlipped: false, isMatched: false },
    { id: pairId * 2 + 1, pairId, icon, isFlipped: false, isMatched: false },
  ]);

  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  return pairs;
}

function renderIcon(icon: CardIcon): string {
  if (icon.type === 'badge') {
    return `<span class="card__badge" style="background:${icon.badgeBg};color:${icon.badgeColor}">${icon.value}</span>`;
  }
  return `<span class="card__emoji">${icon.value}</span>`;
}

function renderCard(card: Card, index: number, cardBackColor: string): string {
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
        <div class="card__face card__face--hidden" style="background:${cardBackColor}">
          <div class="card__face-pattern"></div>
        </div>
        <div class="card__face card__face--revealed">
          ${renderIcon(card.icon)}
        </div>
      </div>
    </button>
  `;
}

export function renderGame(): string {
  const state  = getState();
  const theme  = getTheme(state.settings.theme);
  const cols   = GRID_COLS[state.settings.boardSize];

  // Build cards on first render (cards array empty = new game)
  if (state.cards.length === 0) {
    const cards = buildCards(state.settings.boardSize, theme);
    setState({ cards });
  }

  const { cards, scores, currentPlayer } = getState();
  const cardsHtml = cards.map((card, i) => renderCard(card, i, theme.cardBackColor)).join('');

  const playerDot = (color: 'blue' | 'orange') =>
    `<span class="scorebar__dot scorebar__dot--${color}"></span>`;

  return `
    <div class="game" style="background:${theme.bgColor}">

      <div class="scorebar" style="background:${theme.scoreBarBg}">
        <div class="scorebar__scores">
          ${playerDot('blue')}
          <span class="scorebar__score scorebar__score--blue" style="color:${theme.textColor}">
            Blue ${scores.blue}
          </span>
          ${playerDot('orange')}
          <span class="scorebar__score scorebar__score--orange" style="color:${theme.textColor}">
            Orange ${scores.orange}
          </span>
        </div>

        <div class="scorebar__current" style="color:${theme.textColor}">
          Current player:
          <span class="scorebar__dot scorebar__dot--${currentPlayer}"></span>
        </div>

        <button class="scorebar__exit-btn" id="exit-game-btn" style="border-color:${theme.exitBtnBorder};color:${theme.textColor}">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Exit game
        </button>
      </div>

      <section
        class="field"
        id="field"
        style="grid-template-columns: repeat(${cols}, 1fr)"
      >
        ${cardsHtml}
      </section>

      <div class="modal" id="exit-modal" hidden>
        <div class="modal__box">
          <p class="modal__text">Are you sure you want to quit the game?</p>
          <div class="modal__actions">
            <button class="btn btn--secondary" id="modal-back-btn">Back to game</button>
            <button class="btn btn--danger"    id="modal-exit-btn">Exit game</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initGame(): void {
  const field     = document.getElementById('field');
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

  field?.addEventListener('click', (e) => {
    const state = getState();
    if (state.isLocked) return;

    const cardEl = (e.target as HTMLElement).closest<HTMLButtonElement>('.card');
    if (!cardEl || cardEl.disabled) return;

    const index = Number(cardEl.dataset['index']);
    const card  = state.cards[index];
    if (card.isFlipped || card.isMatched) return;

    flipCard(index);
  });
}

function flipCard(index: number): void {
  const state = getState();
  const cards = [...state.cards];
  cards[index] = { ...cards[index], isFlipped: true };

  const flippedIndexes = [...state.flippedIndexes, index];
  setState({ cards, flippedIndexes });
  updateCardEl(index, cards[index]);

  if (flippedIndexes.length === 2) {
    setState({ isLocked: true });
    checkMatch(flippedIndexes[0], flippedIndexes[1]);
  }
}

function checkMatch(a: number, b: number): void {
  const state  = getState();
  const cards  = [...state.cards];
  const isMatch = cards[a].pairId === cards[b].pairId;

  if (isMatch) {
    cards[a] = { ...cards[a], isMatched: true };
    cards[b] = { ...cards[b], isMatched: true };
    const scores = { ...state.scores };
    scores[state.currentPlayer]++;

    setState({ cards, scores, flippedIndexes: [], isLocked: false });
    updateCardEl(a, cards[a]);
    updateCardEl(b, cards[b]);

    if (cards.every(c => c.isMatched)) {
      setTimeout(() => {
        setState({ screen: 'gameover' });
        render();
      }, 600);
    }
  } else {
    setTimeout(() => {
      const s = getState();
      const updated = [...s.cards];
      updated[a] = { ...updated[a], isFlipped: false };
      updated[b] = { ...updated[b], isFlipped: false };
      const nextPlayer = s.currentPlayer === 'blue' ? 'orange' : 'blue';
      setState({ cards: updated, flippedIndexes: [], isLocked: false, currentPlayer: nextPlayer });
      updateCardEl(a, updated[a]);
      updateCardEl(b, updated[b]);
      updateScorebar();
    }, 1000);
  }
}

function updateCardEl(index: number, card: Card): void {
  const el = document.querySelector<HTMLButtonElement>(`.card[data-index="${index}"]`);
  if (!el) return;
  el.classList.toggle('is-flipped',  card.isFlipped || card.isMatched);
  el.classList.toggle('is-matched',  card.isMatched);
  if (card.isMatched) el.disabled = true;
}

function updateScorebar(): void {
  const state = getState();
  const blueEl   = document.querySelector('.scorebar__score--blue');
  const orangeEl = document.querySelector('.scorebar__score--orange');
  const currentEl = document.querySelector('.scorebar__current');

  if (blueEl)   blueEl.textContent   = `Blue ${state.scores.blue}`;
  if (orangeEl) orangeEl.textContent = `Orange ${state.scores.orange}`;
  if (currentEl) {
    currentEl.innerHTML = `Current player: <span class="scorebar__dot scorebar__dot--${state.currentPlayer}"></span>`;
  }
}
