/**
 * Core game logic utilities for Tic-Tac-Toe
 */

// Initialize empty board
export const createEmptyBoard = () => Array(9).fill(null);

// Get legal moves (empty cells)
export const getLegalMoves = (board) => {
  return board.map((cell, index) => (cell === null ? index : null)).filter((val) => val !== null);
};

// Make a move on the board
export const makeMove = (board, position, player) => {
  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
};

// Check if a player has won
export const checkWinner = (board) => {
  const winPatterns = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal \
    [2, 4, 6], // Diagonal /
  ];

  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
};

// Check if the board is full (draw)
export const isBoardFull = (board) => {
  return board.every((cell) => cell !== null);
};

// Check if game is terminal (win or draw)
export const isTerminal = (board) => {
  const winner = checkWinner(board);
  if (winner) return { terminal: true, winner: winner.winner, line: winner.line };
  if (isBoardFull(board)) return { terminal: true, winner: 'draw', line: null };
  return { terminal: false, winner: null, line: null };
};

// Get opponent player
export const getOpponent = (player) => (player === 'X' ? 'O' : 'X');

// Convert board index to row/col
export const indexToRowCol = (index) => ({
  row: Math.floor(index / 3),
  col: index % 3,
});

// Convert row/col to board index
export const rowColToIndex = (row, col) => row * 3 + col;

// Extract features for ML evaluation
export const extractFeatures = (board, player) => {
  const opponent = getOpponent(player);
  
  // Count marks
  const playerMarks = board.filter((cell) => cell === player).length;
  const opponentMarks = board.filter((cell) => cell === opponent).length;
  
  // Count potential winning lines
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  
  let playerTwoInRow = 0;
  let opponentTwoInRow = 0;
  let playerOneInRow = 0;
  let opponentOneInRow = 0;
  
  for (const [a, b, c] of lines) {
    const lineValues = [board[a], board[b], board[c]];
    const playerCount = lineValues.filter((v) => v === player).length;
    const opponentCount = lineValues.filter((v) => v === opponent).length;
    const emptyCount = lineValues.filter((v) => v === null).length;
    
    // Two in a row (potential win)
    if (playerCount === 2 && emptyCount === 1) playerTwoInRow++;
    if (opponentCount === 2 && emptyCount === 1) opponentTwoInRow++;
    
    // One in a row (potential threat)
    if (playerCount === 1 && emptyCount === 2) playerOneInRow++;
    if (opponentCount === 1 && emptyCount === 2) opponentOneInRow++;
  }
  
  // Check center control
  const centerControl = board[4] === player ? 1 : board[4] === opponent ? -1 : 0;
  
  // Check corner control
  const corners = [0, 2, 6, 8];
  const playerCorners = corners.filter((i) => board[i] === player).length;
  const opponentCorners = corners.filter((i) => board[i] === opponent).length;
  
  return {
    playerMarks,
    opponentMarks,
    playerTwoInRow,
    opponentTwoInRow,
    playerOneInRow,
    opponentOneInRow,
    centerControl,
    playerCorners,
    opponentCorners,
  };
};
