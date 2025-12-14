/**
 * Feature extraction matching the dataset format
 * 
 * Machine-Learned Evaluation Features:
 * This extracts features from the board state that match the training dataset format.
 * 
 * Features include:
 * 1. Number of X marks on the board
 * 2. Number of O marks on the board
 * 3. Number of rows/columns/diagonals where X is close to winning (2 in a row with 1 empty)
 * 4. Number of rows/columns/diagonals where O is close to winning (2 in a row with 1 empty)
 * 5. Whether X is in the center position (1 if yes, 0 if no)
 * 6. Number of corners controlled by X
 * 
 * Labels in dataset: +1 if X eventually wins, -1 if O wins
 * 
 * The model learns optimal weights for these features through training on
 * 2,014 game outcomes from the tictactoe_dataset.csv file.
 */

import { getOpponent } from './gameLogic';

/**
 * Extract features in dataset format for ML evaluation
 * 
 * This function extracts exactly 6 features from the board state:
 * 
 * Feature 1: Number of X marks (0-9)
 * Feature 2: Number of O marks (0-9)
 * Feature 3: X close to winning - count of rows/columns/diagonals where X has 2 marks and 1 empty
 * Feature 4: O close to winning - count of rows/columns/diagonals where O has 2 marks and 1 empty
 * Feature 5: X in center - binary (1 if X controls center position, 0 otherwise)
 * Feature 6: X corners - count of corners (positions 0,2,6,8) controlled by X (0-4)
 * 
 * @param {Array} board - Board state (9 elements: 'X', 'O', or null)
 * @param {string} player - Player to evaluate for ('X' or 'O')
 * @returns {Array} - Feature vector [xCount, oCount, xAlmostWin, oAlmostWin, xCenter, xCorners]
 */
export const extractDatasetFeatures = (board, player) => {
  const opponent = getOpponent(player);
  
  // Feature 1: Number of X marks
  const xCount = board.filter(cell => cell === 'X').length;
  
  // Feature 2: Number of O marks
  const oCount = board.filter(cell => cell === 'O').length;
  
  // Feature 3 & 4: Count rows/columns/diagonals where X or O is close to winning
  // "Close to winning" means: 2 of the player's marks in a line with 1 empty cell
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  
  let xAlmostWin = 0;
  let oAlmostWin = 0;
  
  for (const [a, b, c] of lines) {
    const lineValues = [board[a], board[b], board[c]];
    const xInLine = lineValues.filter(v => v === 'X').length;
    const oInLine = lineValues.filter(v => v === 'O').length;
    const emptyInLine = lineValues.filter(v => v === null).length;
    
    // X has 2 marks and 1 empty = X is close to winning on this line
    if (xInLine === 2 && emptyInLine === 1) xAlmostWin++;
    
    // O has 2 marks and 1 empty = O is close to winning on this line
    if (oInLine === 2 && emptyInLine === 1) oAlmostWin++;
  }
  
  // Feature 5: X in center (position 4)
  const xCenter = board[4] === 'X' ? 1 : 0;
  
  // Feature 6: X corners count (corners are positions: 0, 2, 6, 8)
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
