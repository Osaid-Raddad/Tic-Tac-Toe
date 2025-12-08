/**
 * Alpha-Beta Pruning Algorithm for Tic-Tac-Toe
 */

import { getLegalMoves, makeMove, isTerminal, getOpponent } from './gameLogic';

/**
 * Alpha-Beta Pruning with Minimax
 * @param {Array} board - Current board state
 * @param {number} depth - Current depth in search tree
 * @param {number} alpha - Alpha value for pruning
 * @param {number} beta - Beta value for pruning
 * @param {boolean} isMaximizing - True if maximizing player
 * @param {string} aiPlayer - AI player symbol ('X' or 'O')
 * @param {Function} evaluateFunction - Evaluation function to use
 * @param {number} maxDepth - Maximum search depth based on difficulty
 * @returns {number} - Best evaluation score
 */
const alphaBetaSearch = (
  board,
  depth,
  alpha,
  beta,
  isMaximizing,
  aiPlayer,
  evaluateFunction,
  maxDepth
) => {
  const terminalState = isTerminal(board);
  
  // Terminal state evaluation
  if (terminalState.terminal) {
    if (terminalState.winner === aiPlayer) return 100 - depth; // AI wins (prefer faster wins)
    if (terminalState.winner === getOpponent(aiPlayer)) return depth - 100; // AI loses (prefer slower losses)
    return 0; // Draw
  }
  
  // Depth limit reached - use evaluation function
  if (depth >= maxDepth) {
    return evaluateFunction(board, aiPlayer);
  }
  
  const legalMoves = getLegalMoves(board);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const newBoard = makeMove(board, move, aiPlayer);
      const evaluation = alphaBetaSearch(
        newBoard,
        depth + 1,
        alpha,
        beta,
        false,
        aiPlayer,
        evaluateFunction,
        maxDepth
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Beta cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const opponent = getOpponent(aiPlayer);
    for (const move of legalMoves) {
      const newBoard = makeMove(board, move, opponent);
      const evaluation = alphaBetaSearch(
        newBoard,
        depth + 1,
        alpha,
        beta,
        true,
        aiPlayer,
        evaluateFunction,
        maxDepth
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha cutoff
    }
    return minEval;
  }
};

/**
 * Find the best move for AI using Alpha-Beta pruning
 * @param {Array} board - Current board state
 * @param {string} aiPlayer - AI player symbol
 * @param {Function} evaluateFunction - Evaluation function
 * @param {number} maxDepth - Search depth
 * @returns {Object} - Best move and its evaluation
 */
export const findBestMove = (board, aiPlayer, evaluateFunction, maxDepth) => {
  const legalMoves = getLegalMoves(board);
  let bestMove = null;
  let bestValue = -Infinity;
  const moveEvaluations = [];
  
  for (const move of legalMoves) {
    const newBoard = makeMove(board, move, aiPlayer);
    const moveValue = alphaBetaSearch(
      newBoard,
      0,
      -Infinity,
      Infinity,
      false,
      aiPlayer,
      evaluateFunction,
      maxDepth
    );
    
    moveEvaluations.push({ move, value: moveValue });
    
    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }
  
  return { bestMove, bestValue, moveEvaluations };
};

/**
 * Get all move evaluations for display
 * @param {Array} board - Current board state
 * @param {string} aiPlayer - AI player symbol
 * @param {Function} evaluateFunction - Evaluation function
 * @param {number} maxDepth - Search depth
 * @returns {Array} - Array of move evaluations
 */
export const getAllMoveEvaluations = (board, aiPlayer, evaluateFunction, maxDepth) => {
  const legalMoves = getLegalMoves(board);
  const evaluations = [];
  
  for (const move of legalMoves) {
    const newBoard = makeMove(board, move, aiPlayer);
    const value = alphaBetaSearch(
      newBoard,
      0,
      -Infinity,
      Infinity,
      false,
      aiPlayer,
      evaluateFunction,
      maxDepth
    );
    evaluations.push({ move, value });
  }
  
  return evaluations.sort((a, b) => b.value - a.value);
};
