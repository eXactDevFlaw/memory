import type { PlayerColor } from '../types/index';
import type { ThemeScoreBoxConfig } from '../data/themes';

const SCORE_TAG_PATH = `${import.meta.env.BASE_URL}ui/label.svg`;
const PAWN_ICON_PATH = `${import.meta.env.BASE_URL}ui/icon-player.svg`;

/**
 * Returns the mask-colored tag icon used next to player scores.
 * @param player - The player the tag's color should match.
 * @returns HTML markup for the tag icon `<span>`.
 */
export function renderPlayerTag(player: PlayerColor): string {
  return `<span class="player-tag player-tag--${player}" style="--mask-src:url('${SCORE_TAG_PATH}')" aria-hidden="true"></span>`;
}

/**
 * Returns a white pawn on a tile in the player's color.
 * @param player - The player the tile's color should match.
 * @returns HTML markup for the pawn tile `<span>`.
 */
function renderPlayerTile(player: PlayerColor): string {
  return `
    <span class="player-tile player-tile--${player}" aria-hidden="true">
      <span class="player-tile__pawn" style="--mask-src:url('${PAWN_ICON_PATH}')"></span>
    </span>
  `;
}

/**
 * Returns the marker that shows whose turn it is, matching the score box's layout.
 * @param player - The player whose turn it is.
 * @param layout - The theme's score-box layout.
 * @returns HTML markup for the current-player marker.
 */
export function renderCurrentPlayerMarker(player: PlayerColor, layout: ThemeScoreBoxConfig['layout']): string {
  return layout === 'compact' ? renderPlayerTile(player) : renderPlayerTag(player);
}

/**
 * Returns a "labeled" score entry: colored tag + "Blue 3".
 * @param player - The player this entry represents.
 * @param score - The player's score.
 * @returns HTML markup for one score entry.
 */
function renderLabeledEntry(player: PlayerColor, score: number): string {
  const label = player === 'blue' ? 'Blue' : 'Orange';
  return `
    <div class="score-box__entry">
      ${renderPlayerTag(player)}
      <span class="score-box__text score-box__text--${player}">${label} ${score}</span>
    </div>
  `;
}

/**
 * Returns a "compact" score entry: colored pawn + score only.
 * @param player - The player this entry represents.
 * @param score - The player's score.
 * @returns HTML markup for one score entry.
 */
function renderCompactEntry(player: PlayerColor, score: number): string {
  return `
    <div class="score-box__entry">
      <span class="score-box__pawn score-box__pawn--${player}" style="--mask-src:url('${PAWN_ICON_PATH}')" aria-hidden="true"></span>
      <span class="score-box__text score-box__text--${player}">${score}</span>
    </div>
  `;
}

/**
 * Returns the blue/orange score box shared by the game and game-over screens.
 * @param scores - The score for each player.
 * @param config - The theme's score-box layout and background.
 * @returns HTML markup for the score box.
 */
export function renderScoresBox(scores: Record<PlayerColor, number>, config: ThemeScoreBoxConfig): string {
  const entries = config.layout === 'compact'
    ? renderCompactEntry('orange', scores.orange) + renderCompactEntry('blue', scores.blue)
    : renderLabeledEntry('blue', scores.blue) + renderLabeledEntry('orange', scores.orange);
  return `
    <div class="score-box score-box--${config.layout}" style="background:${config.bg}">
      ${entries}
    </div>
  `;
}
