/**
 * Classical Heuristic Evaluation Function
 * Based on human strategic thinking and game theory
 */

import { isTerminal, getOpponent, extractFeatures } from './gameLogic';

/**
 * Evaluate board using classical heuristic based on human logic
 * Human strategy priorities:
 * 1. Win immediately if possible
 * 2. Block opponent's immediate win
 * 3. Create forks (multiple winning threats)
 * 4. Block opponent's forks
 * 5. Control center (most strategic position)
 * 6. Control corners (second best positions)
 * 7. Build towards winning lines
 * 
 * @param {Array} board - Current board state
 * @param {string} player - Player to evaluate for
 * @returns {number} - Evaluation score
 */
export const classicalEvaluate = (board, player) => {
  const terminalState = isTerminal(board);
  
  // Terminal states - highest priority
  if (terminalState.terminal) {
    if (terminalState.winner === player) return 1000; // We win!
    if (terminalState.winner === getOpponent(player)) return -1000; // We lose!
    return 0; // Draw
  }
  
  let score = 0;
  const opponent = getOpponent(player);
  
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];
  
  // HUMAN LOGIC 1: Check for immediate wins and threats
  let canWinNow = 0;
  let mustBlockNow = 0;
  
  for (const [a, b, c] of lines) {
    const lineValues = [board[a], board[b], board[c]];
    const playerCount = lineValues.filter((v) => v === player).length;
    const opponentCount = lineValues.filter((v) => v === opponent).length;
    const emptyCount = lineValues.filter((v) => v === null).length;
    
    // Can win on next move (2 in a row with empty)
    if (playerCount === 2 && emptyCount === 1) {
      canWinNow++;
      score += 500; // Very high priority!
    }
    
    // Must block opponent's win (they have 2 in a row)
    if (opponentCount === 2 && emptyCount === 1) {
      mustBlockNow++;
      score -= 600; // Even higher priority than winning! (defensive)
    }
    
    // Building towards win (1 in a row with 2 empty)
    if (playerCount === 1 && emptyCount === 2) {
      score += 10; // Good potential
    }
    
    // Opponent building (1 in a row with 2 empty)
    if (opponentCount === 1 && emptyCount === 2) {
      score -= 12; // Slightly more concerning
    }
  }
  
  // HUMAN LOGIC 2: Fork detection (multiple winning threats)
  // A fork means having 2 or more ways to win
  if (canWinNow >= 2) {
    score += 300; // Fork! Multiple winning moves
  }
  
  if (mustBlockNow >= 2) {
    score -= 400; // Opponent has fork - very dangerous!
  }
  
  // HUMAN LOGIC 3: Center control (most valuable position)
  // Humans know center gives most opportunities
  if (board[4] === player) {
    score += 40;
  } else if (board[4] === opponent) {
    score -= 40;
  } else if (board[4] === null) {
    // Empty center is an opportunity
    score += 5;
  }
  
  // HUMAN LOGIC 4: Corner control (second most valuable)
  // Corners create diagonal and side winning chances
  const corners = [0, 2, 6, 8];
  let playerCorners = 0;
  let opponentCorners = 0;
  
  for (const corner of corners) {
    if (board[corner] === player) {
      playerCorners++;
      score += 20;
    } else if (board[corner] === opponent) {
      opponentCorners++;
      score -= 20;
    }
  }
  
  // Opposite corners strategy (very strong for humans)
  if ((board[0] === player && board[8] === player) || 
      (board[2] === player && board[6] === player)) {
    score += 50; // Opposite corners = strong position
  }
  
  if ((board[0] === opponent && board[8] === opponent) || 
      (board[2] === opponent && board[6] === opponent)) {
    score -= 60; // Opponent has opposite corners
  }
  
  // HUMAN LOGIC 5: Edge control (least valuable but still matters)
  const edges = [1, 3, 5, 7];
  for (const edge of edges) {
    if (board[edge] === player) {
      score += 5;
    } else if (board[edge] === opponent) {
      score -= 5;
    }
  }
  
  // HUMAN LOGIC 6: Pattern recognition
  // Center + corner combo (classic human strategy)
  if (board[4] === player) {
    for (const corner of corners) {
      if (board[corner] === player) {
        score += 15; // Center + corner is strong
      }
    }
  }
  
  // HUMAN LOGIC 7: Mobility (number of available winning lines)
  let playerWinningLines = 0;
  let opponentWinningLines = 0;
  
  for (const [a, b, c] of lines) {
    const lineValues = [board[a], board[b], board[c]];
    const hasPlayer = lineValues.some(v => v === player);
    const hasOpponent = lineValues.some(v => v === opponent);
    
    // Line is still available for player (no opponent marks)
    if (hasPlayer && !hasOpponent) {
      playerWinningLines++;
    }
    
    // Line is still available for opponent (no player marks)
    if (hasOpponent && !hasPlayer) {
      opponentWinningLines++;
    }
  }
  
  score += playerWinningLines * 3;
  score -= opponentWinningLines * 3;
  
  return score;
};

/**
 * Get difficulty settings for classical evaluation
 * @param {string} difficulty - 'easy', 'normal', or 'hard'
 * @returns {number} - Max search depth
 */
export const getClassicalDepth = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 1; // Very shallow - only looks 1 move ahead (like a beginner)
    case 'normal':
      return 3; // Moderate - plans a few moves ahead (intermediate player)
    case 'hard':
      return 9; // Full search - perfect play (expert level)
    default:
      return 3;
  }
};
