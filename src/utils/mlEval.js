/**
 * Machine Learning-Based Evaluation Function
 * Uses trained weights based on game features
 */

import { isTerminal, getOpponent } from './gameLogic';
import { extractDatasetFeatures } from './featureExtractor';

/**
 * Default trained weights for ML model (matches dataset features)
 * Format: [x_count, o_count, x_almost_win, o_almost_win, x_center, x_corners]
 */
let MODEL_WEIGHTS = {
  bias: 0.5,
  weights: [2.5, -2.5, 18.0, -22.0, 6.0, 3.5] // Default weights
};

/**
 * Update ML weights with trained model
 * @param {Object} model - Trained model with weights
 */
export const updateMLWeights = (model) => {
  if (model && model.featureWeights && model.featureWeights.length >= 6) {
    MODEL_WEIGHTS = {
      bias: model.bias || 0,
      weights: model.featureWeights
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('ml_model', JSON.stringify(MODEL_WEIGHTS));
    console.log('✅ ML Model Updated:', MODEL_WEIGHTS);
  }
};

/**
 * Load weights from localStorage if available
 */
export const loadSavedWeights = () => {
  try {
    const saved = localStorage.getItem('ml_model');
    if (saved) {
      MODEL_WEIGHTS = JSON.parse(saved);
      console.log('📦 Loaded saved model:', MODEL_WEIGHTS);
      return true;
    }
  } catch (error) {
    console.error('Failed to load saved weights:', error);
  }
  return false;
};

/**
 * Get current ML weights
 * @returns {Object} - Current weights
 */
export const getCurrentWeights = () => MODEL_WEIGHTS;

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
  
  // Extract features matching dataset format
  const features = extractDatasetFeatures(board, player);
  
  // Calculate score using trained weights
  let score = MODEL_WEIGHTS.bias;
  
  // If evaluating for X, use features as-is
  // If evaluating for O, flip the perspective
  if (player === 'X') {
    for (let i = 0; i < features.length && i < MODEL_WEIGHTS.weights.length; i++) {
      score += features[i] * MODEL_WEIGHTS.weights[i];
    }
  } else {
    // For O, flip X and O features
    const flipped = [
      features[1],  // O count
      features[0],  // X count  
      features[3],  // O almost win
      features[2],  // X almost win
      features[4],  // center (approximate)
      features[5]   // corners
    ];
    for (let i = 0; i < flipped.length && i < MODEL_WEIGHTS.weights.length; i++) {
      score += flipped[i] * MODEL_WEIGHTS.weights[i];
    }
  }
  
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
        depth: 1, // Very shallow for easy mode
        evaluator: mlEvaluate,
        noiseLevel: 0.3,
      };
    case 'normal':
      return {
        depth: 3,
        evaluator: mlEvaluate,
        noiseLevel: 0,
      };
    case 'hard':
      return {
        depth: 9,
        evaluator: mlEvaluate,
        noiseLevel: 0,
      };
    default:
      return {
        depth: 3,
        evaluator: mlEvaluate,
        noiseLevel: 0,
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
