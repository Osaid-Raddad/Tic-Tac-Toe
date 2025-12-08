/**
 * Classical Heuristic Evaluation Function
 * Hand-coded evaluation based on strategic positions
 */

import { isTerminal, getOpponent, extractFeatures } from './gameLogic';

/**
 * Evaluate board using classical heuristic
 * @param {Array} board - Current board state
 * @param {string} player - Player to evaluate for
 * @returns {number} - Evaluation score
 */
export const classicalEvaluate = (board, player) => {
  const terminalState = isTerminal(board);
  
  // Terminal states
  if (terminalState.terminal) {
    if (terminalState.winner === player) return 100;
    if (terminalState.winner === getOpponent(player)) return -100;
    return 0; // Draw
  }
  
  let score = 0;
  const opponent = getOpponent(player);
  
  // Center control (most important position)
  if (board[4] === player) score += 8;
  else if (board[4] === opponent) score -= 8;
  
  // Corner control (second most important)
  const corners = [0, 2, 6, 8];
  for (const corner of corners) {
    if (board[corner] === player) score += 4;
    else if (board[corner] === opponent) score -= 4;
  }
  
  // Edge control
  const edges = [1, 3, 5, 7];
  for (const edge of edges) {
    if (board[edge] === player) score += 2;
    else if (board[edge] === opponent) score -= 2;
  }
  
  // Evaluate lines (rows, columns, diagonals)
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];
  
  for (const [a, b, c] of lines) {
    const lineValues = [board[a], board[b], board[c]];
    const playerCount = lineValues.filter((v) => v === player).length;
    const opponentCount = lineValues.filter((v) => v === opponent).length;
    const emptyCount = lineValues.filter((v) => v === null).length;
    
    // Two in a row (about to win)
    if (playerCount === 2 && emptyCount === 1) score += 15;
    if (opponentCount === 2 && emptyCount === 1) score -= 20; // Block opponent's win is crucial
    
    // One in a row (potential)
    if (playerCount === 1 && emptyCount === 2) score += 3;
    if (opponentCount === 1 && emptyCount === 2) score -= 3;
    
    // Control entire line
    if (playerCount === 3) score += 100;
    if (opponentCount === 3) score -= 100;
  }
  
  // Fork opportunities (two ways to win)
  const forkScore = evaluateForks(board, player);
  score += forkScore;
  
  return score;
};

/**
 * Evaluate potential forks (situations with multiple winning threats)
 * @param {Array} board - Current board state
 * @param {string} player - Player to evaluate
 * @returns {number} - Fork evaluation score
 */
const evaluateForks = (board, player) => {
  const opponent = getOpponent(player);
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  
  let playerThreats = 0;
  let opponentThreats = 0;
  
  for (const [a, b, c] of lines) {
    const lineValues = [board[a], board[b], board[c]];
    const playerCount = lineValues.filter((v) => v === player).length;
    const opponentCount = lineValues.filter((v) => v === opponent).length;
    const emptyCount = lineValues.filter((v) => v === null).length;
    
    if (playerCount === 2 && emptyCount === 1) playerThreats++;
    if (opponentCount === 2 && emptyCount === 1) opponentThreats++;
  }
  
  let forkScore = 0;
  
  // Multiple winning threats (fork)
  if (playerThreats >= 2) forkScore += 25;
  if (opponentThreats >= 2) forkScore -= 30; // Block opponent fork
  
  return forkScore;
};

/**
 * Get difficulty settings for classical evaluation
 * @param {string} difficulty - 'easy', 'normal', or 'hard'
 * @returns {number} - Max search depth
 */
export const getClassicalDepth = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 2; // Shallow search, makes mistakes
    case 'normal':
      return 4; // Moderate search
    case 'hard':
      return 9; // Full search (perfect play)
    default:
      return 4;
  }
};
