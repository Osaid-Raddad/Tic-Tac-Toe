/**
 * Feature extraction matching the dataset format
 */

import { getOpponent } from './gameLogic';

/**
 * Extract features in dataset format for ML evaluation
 * @param {Array} board - Board state
 * @param {string} player - Player to evaluate for
 * @returns {Array} - Feature vector matching dataset
 */
export const extractDatasetFeatures = (board, player) => {
  const opponent = getOpponent(player);
  
  // Feature 1: X count (always X, not current player)
  const xCount = board.filter(cell => cell === 'X').length;
  
  // Feature 2: O count (always O, not opponent)
  const oCount = board.filter(cell => cell === 'O').length;
  
  // Feature 3 & 4: Almost win counts (2 in a row with empty)
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  
  let xAlmostWin = 0;
  let oAlmostWin = 0;
  
  for (const [a, b, c] of lines) {
    const lineValues = [board[a], board[b], board[c]];
    const xInLine = lineValues.filter(v => v === 'X').length;
    const oInLine = lineValues.filter(v => v === 'O').length;
    const emptyInLine = lineValues.filter(v => v === null).length;
    
    if (xInLine === 2 && emptyInLine === 1) xAlmostWin++;
    if (oInLine === 2 && emptyInLine === 1) oAlmostWin++;
  }
  
  // Feature 5: X has center
  const xCenter = board[4] === 'X' ? 1 : 0;
  
  // Feature 6: X corners count
  const corners = [0, 2, 6, 8];
  const xCorners = corners.filter(i => board[i] === 'X').length;
  
  return [xCount, oCount, xAlmostWin, oAlmostWin, xCenter, xCorners];
};

/**
 * Convert features based on which player we're evaluating for
 * @param {Array} features - Raw dataset features
 * @param {string} player - Player being evaluated
 * @returns {Array} - Adjusted features
 */
export const adjustFeaturesForPlayer = (features, player) => {
  // Features are always from X's perspective in dataset
  // If evaluating for O, we need to flip the perspective
  if (player === 'O') {
    return [
      features[1], // O count becomes first
      features[0], // X count becomes second
      features[3], // O almost win
      features[2], // X almost win
      features[4] === 1 ? 0 : (features[4] === 0 && features[0] + features[1] >= 1 ? 1 : 0), // O center
      features[5], // corners stay same for simplicity
    ];
  }
  return features;
};
