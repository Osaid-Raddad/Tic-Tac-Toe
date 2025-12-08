/**
 * Machine Learning-Based Evaluation Function
 * Uses trained weights based on game features
 */

import { isTerminal, getOpponent, extractFeatures } from './gameLogic';

/**
 * Trained weights for ML model (simulated training on Tic-Tac-Toe dataset)
 * These weights are based on feature importance for predicting game outcomes
 * In a real scenario, these would be trained using a dataset of game outcomes
 */
const TRAINED_WEIGHTS = {
  playerMarks: 2.5,
  opponentMarks: -2.5,
  playerTwoInRow: 18.0,
  opponentTwoInRow: -22.0,
  playerOneInRow: 4.5,
  opponentOneInRow: -4.5,
  centerControl: 6.0,
  playerCorners: 3.5,
  opponentCorners: -3.5,
  bias: 0.5,
};

/**
 * Evaluate board using ML-based approach
 * @param {Array} board - Current board state
 * @param {string} player - Player to evaluate for
 * @returns {number} - Evaluation score
 */
export const mlEvaluate = (board, player) => {
  const terminalState = isTerminal(board);
  
  // Terminal states (definitive outcomes)
  if (terminalState.terminal) {
    if (terminalState.winner === player) return 100;
    if (terminalState.winner === getOpponent(player)) return -100;
    return 0; // Draw
  }
  
  // Extract features from board
  const features = extractFeatures(board, player);
  
  // Calculate weighted sum (linear model)
  let score = TRAINED_WEIGHTS.bias;
  score += features.playerMarks * TRAINED_WEIGHTS.playerMarks;
  score += features.opponentMarks * TRAINED_WEIGHTS.opponentMarks;
  score += features.playerTwoInRow * TRAINED_WEIGHTS.playerTwoInRow;
  score += features.opponentTwoInRow * TRAINED_WEIGHTS.opponentTwoInRow;
  score += features.playerOneInRow * TRAINED_WEIGHTS.playerOneInRow;
  score += features.opponentOneInRow * TRAINED_WEIGHTS.opponentOneInRow;
  score += features.centerControl * TRAINED_WEIGHTS.centerControl;
  score += features.playerCorners * TRAINED_WEIGHTS.playerCorners;
  score += features.opponentCorners * TRAINED_WEIGHTS.opponentCorners;
  
  // Normalize score to reasonable range
  return Math.max(-90, Math.min(90, score));
};

/**
 * Advanced ML evaluation with non-linear features
 * @param {Array} board - Current board state
 * @param {string} player - Player to evaluate for
 * @returns {number} - Evaluation score
 */
export const mlEvaluateAdvanced = (board, player) => {
  const terminalState = isTerminal(board);
  
  if (terminalState.terminal) {
    if (terminalState.winner === player) return 100;
    if (terminalState.winner === getOpponent(player)) return -100;
    return 0;
  }
  
  const features = extractFeatures(board, player);
  
  // Non-linear features
  const threatDifference = features.playerTwoInRow - features.opponentTwoInRow;
  const controlDifference = features.playerOneInRow - features.opponentOneInRow;
  const positionAdvantage = 
    features.centerControl * 6 + 
    (features.playerCorners - features.opponentCorners) * 3;
  
  // Interaction terms
  const forkPotential = features.playerTwoInRow > 1 ? 20 : 0;
  const blockingNecessity = features.opponentTwoInRow > 1 ? -25 : 0;
  
  let score = 0;
  score += threatDifference * 20;
  score += controlDifference * 5;
  score += positionAdvantage;
  score += forkPotential;
  score += blockingNecessity;
  score += (features.playerMarks - features.opponentMarks) * 2;
  
  return Math.max(-90, Math.min(90, score));
};

/**
 * Get difficulty settings for ML evaluation
 * @param {string} difficulty - 'easy', 'normal', or 'hard'
 * @returns {Object} - Configuration for ML evaluation
 */
export const getMLConfig = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return {
        depth: 2,
        evaluator: mlEvaluate,
        noiseLevel: 0.3, // Add randomness for easier play
      };
    case 'normal':
      return {
        depth: 4,
        evaluator: mlEvaluateAdvanced,
        noiseLevel: 0.1,
      };
    case 'hard':
      return {
        depth: 9,
        evaluator: mlEvaluateAdvanced,
        noiseLevel: 0,
      };
    default:
      return {
        depth: 4,
        evaluator: mlEvaluate,
        noiseLevel: 0.1,
      };
  }
};

/**
 * Add noise to evaluation for easier difficulty levels
 * @param {number} score - Original evaluation score
 * @param {number} noiseLevel - Amount of noise (0-1)
 * @returns {number} - Noisy score
 */
export const addNoise = (score, noiseLevel) => {
  if (noiseLevel === 0) return score;
  const noise = (Math.random() - 0.5) * 2 * noiseLevel * 20;
  return score + noise;
};

/**
 * Get feature importance explanation
 * @param {Array} board - Current board state
 * @param {string} player - Player to evaluate
 * @returns {Object} - Feature importance breakdown
 */
export const explainFeatures = (board, player) => {
  const features = extractFeatures(board, player);
  
  return {
    features,
    contributions: {
      twoInRowThreat: features.playerTwoInRow * TRAINED_WEIGHTS.playerTwoInRow,
      blockingNeed: features.opponentTwoInRow * TRAINED_WEIGHTS.opponentTwoInRow,
      centerControl: features.centerControl * TRAINED_WEIGHTS.centerControl,
      cornerAdvantage: (features.playerCorners - features.opponentCorners) * TRAINED_WEIGHTS.playerCorners,
      totalAdvantage: mlEvaluate(board, player),
    },
  };
};
