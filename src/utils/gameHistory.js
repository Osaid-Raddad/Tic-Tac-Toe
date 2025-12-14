/**
 * Game History Storage
 * Stores completed games for continuous ML training
 */

import { extractDatasetFeatures } from './featureExtractor';

const STORAGE_KEY = 'tictactoe_game_history';

/**
 * Save a completed game to history
 * @param {Array} moveHistory - Array of moves made in the game
 * @param {string} winner - 'X', 'O', or 'draw'
 */
export const saveGameToHistory = (moveHistory, winner) => {
  if (winner === 'draw' || moveHistory.length === 0) {
    return; // Only save decisive games
  }

  try {
    const history = getGameHistory();
    
    // Extract features from final board state
    const finalMove = moveHistory[moveHistory.length - 1];
    const finalBoard = finalMove.board;
    
    // Create training sample
    // Features are extracted for X player perspective
    const features = extractDatasetFeatures(finalBoard, 'X');
    const label = winner === 'X' ? 1 : -1;
    
    const gameSample = {
      features,
      label,
      timestamp: Date.now(),
      moves: moveHistory.length
    };
    
    history.push(gameSample);
    
    // Keep only last 500 games to prevent storage bloat
    if (history.length > 500) {
      history.shift();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    console.log(`📝 Game saved to history (${history.length} total games)`);
    
  } catch (error) {
    console.error('Failed to save game to history:', error);
  }
};

/**
 * Get all stored games
 * @returns {Array} - Array of game samples
 */
export const getGameHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load game history:', error);
    return [];
  }
};

/**
 * Clear game history
 */
export const clearGameHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ Game history cleared');
};

/**
 * Get game history statistics
 * @returns {Object} - Statistics about stored games
 */
export const getHistoryStats = () => {
  const history = getGameHistory();
  
  if (history.length === 0) {
    return {
      totalGames: 0,
      xWins: 0,
      oWins: 0
    };
  }
  
  const xWins = history.filter(g => g.label === 1).length;
  const oWins = history.filter(g => g.label === -1).length;
  
  return {
    totalGames: history.length,
    xWins,
    oWins,
    winRate: {
      x: ((xWins / history.length) * 100).toFixed(1),
      o: ((oWins / history.length) * 100).toFixed(1)
    }
  };
};
