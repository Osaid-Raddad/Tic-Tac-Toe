import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  createEmptyBoard,
  getLegalMoves,
  makeMove,
  isTerminal,
  getOpponent,
} from '../utils/gameLogic';
import { findBestMove, getAllMoveEvaluations } from '../utils/alphaBeta';
import { classicalEvaluate, getClassicalDepth } from '../utils/classicalEval';
import { mlEvaluate, getMLConfig, updateMLWeights, loadSavedWeights } from '../utils/mlEval';
import GameSettings from './GameSettings';
import MoveEvaluator from './MoveEvaluator';
import DatasetTrainer from './DatasetTrainer';

const TicTacToe = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, draw
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [showSettings, setShowSettings] = useState(true);
  const [gameConfig, setGameConfig] = useState({
    humanPlayer: 'X',
    aiPlayer: 'O',
    difficulty: 'normal',
    evaluationType: 'classical',
  });
  const [moveEvaluations, setMoveEvaluations] = useState([]);
  const [showEvaluations, setShowEvaluations] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [showTrainer, setShowTrainer] = useState(false);

  // Load saved ML weights on mount
  useEffect(() => {
    loadSavedWeights();
  }, []);

  // Reset game
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinner(null);
    setWinningLine(null);
    setMoveEvaluations([]);
    setMoveHistory([]);
  };

  // Start new game with settings
  const startGame = (config) => {
    setGameConfig(config);
    setShowSettings(false);
    resetGame();
    
    // If AI plays first (X), make AI move
    if (config.aiPlayer === 'X') {
      setTimeout(() => makeAIMove(createEmptyBoard(), 'X', config), 500);
    } else {
      // Human plays first, show initial evaluations
      setTimeout(() => {
        const evaluationFunc = getEvaluationFunction(config);
        const depth = getSearchDepth(config);
        const initialEvals = getAllMoveEvaluations(
          createEmptyBoard(),
          config.aiPlayer,
          evaluationFunc,
          depth
        );
        setMoveEvaluations(initialEvals);
      }, 100);
    }
  };

  // Get evaluation function based on config
  const getEvaluationFunction = (config) => {
    if (config.evaluationType === 'classical') {
      return classicalEvaluate;
    } else {
      return mlEvaluate;
    }
  };

  // Get search depth based on config
  const getSearchDepth = (config) => {
    if (config.evaluationType === 'classical') {
      return getClassicalDepth(config.difficulty);
    } else {
      return getMLConfig(config.difficulty).depth;
    }
  };

  // Make AI move
  const makeAIMove = (currentBoard, player, config) => {
    setThinking(true);
    
    setTimeout(() => {
      const evaluationFunc = getEvaluationFunction(config);
      const depth = getSearchDepth(config);
      
      const { bestMove, bestValue, moveEvaluations: evals } = findBestMove(
        currentBoard,
        player,
        evaluationFunc,
        depth,
        config.difficulty
      );
      
      if (bestMove !== null) {
        const newBoard = makeMove(currentBoard, bestMove, player);
        setBoard(newBoard);
        setMoveHistory([...moveHistory, { player, move: bestMove, board: newBoard }]);
        
        // Check game status
        const terminal = isTerminal(newBoard);
        if (terminal.terminal) {
          handleGameEnd(terminal);
          setMoveEvaluations([]);
        } else {
          setCurrentPlayer(getOpponent(player));
          
          // Update evaluations for human's next turn
          const humanEvals = getAllMoveEvaluations(
            newBoard,
            config.aiPlayer,
            evaluationFunc,
            depth
          );
          setMoveEvaluations(humanEvals);
        }
      }
      
      setThinking(false);
    }, 600);
  };

  // Handle human move
  const handleCellClick = (index) => {
    if (gameStatus !== 'playing' || thinking) return;
    if (board[index] !== null) return;
    if (currentPlayer !== gameConfig.humanPlayer) return;
    
    const newBoard = makeMove(board, index, currentPlayer);
    setBoard(newBoard);
    setMoveHistory([...moveHistory, { player: currentPlayer, move: index, board: newBoard }]);
    
    // Check game status
    const terminal = isTerminal(newBoard);
    if (terminal.terminal) {
      handleGameEnd(terminal);
      setMoveEvaluations([]);
    } else {
      setCurrentPlayer(getOpponent(currentPlayer));
      // AI's turn
      makeAIMove(newBoard, getOpponent(currentPlayer), gameConfig);
    }
  };

  // Handle game end
  const handleGameEnd = (terminal) => {
    if (terminal.winner === 'draw') {
      setGameStatus('draw');
      toast.info('Game ended in a draw!');
    } else {
      setGameStatus('won');
      setWinner(terminal.winner);
      setWinningLine(terminal.line);
      
      if (terminal.winner === gameConfig.humanPlayer) {
        toast.success('🎉 You won!');
      } else {
        toast.error('AI won! Better luck next time.');
      }
    }
  };

  // Get cell classes
  const getCellClasses = (index) => {
    let classes = 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center text-5xl sm:text-6xl font-bold cursor-pointer transition-all duration-300 hover:scale-105 ';
    
    // Background based on state
    if (winningLine && winningLine.includes(index)) {
      classes += 'bg-linear-to-br from-green-400 to-green-600 ';
    } else if (board[index] === 'X') {
      classes += 'bg-linear-to-br from-blue-400 to-blue-600 ';
    } else if (board[index] === 'O') {
      classes += 'bg-linear-to-br from-purple-400 to-purple-600 ';
    } else {
      classes += 'bg-linear-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 ';
    }
    
    // Borders
    classes += 'rounded-xl shadow-lg ';
    
    // Text color
    classes += 'text-white ';
    
    // Disabled state
    if (gameStatus !== 'playing' || thinking || currentPlayer !== gameConfig.humanPlayer) {
      classes += 'cursor-not-allowed ';
    }
    
    return classes;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎮 Tic-Tac-Toe AI
          </h1>
          <p className="text-xl text-purple-200">
            {gameStatus === 'playing' && !thinking && (
              <>Current Turn: <span className="font-bold text-yellow-300">{currentPlayer}</span></>
            )}
            {thinking && <span className="text-cyan-300 animate-pulse">🤖 AI is thinking...</span>}
            {gameStatus === 'won' && (
              <span className="text-green-300 font-bold">🏆 {winner} Wins!</span>
            )}
            {gameStatus === 'draw' && <span className="text-gray-300 font-bold">🤝 Draw!</span>}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-900/50 p-6 rounded-2xl shadow-2xl backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-3">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={getCellClasses(index)}
                    disabled={
                      gameStatus !== 'playing' ||
                      thinking ||
                      currentPlayer !== gameConfig.humanPlayer ||
                      cell !== null
                    }
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                🔄 Reset Game
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => setShowTrainer(true)}
                className="px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                🤖 Train Model
              </button>
            </div>

            {/* Game Info */}
            <div className="mt-6 bg-gray-900/50 p-4 rounded-xl backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4 text-white text-center">
                <div>
                  <p className="text-sm text-gray-400">You</p>
                  <p className="text-2xl font-bold text-blue-400">{gameConfig.humanPlayer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">AI</p>
                  <p className="text-2xl font-bold text-purple-400">{gameConfig.aiPlayer}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-gray-300">
                  <span className="font-semibold text-cyan-400">Difficulty:</span>{' '}
                  <span className="capitalize">{gameConfig.difficulty}</span>
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold text-cyan-400">Evaluation:</span>{' '}
                  <span className="capitalize">
                    {gameConfig.evaluationType === 'classical'
                      ? 'Classical Heuristic'
                      : 'Machine Learning'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Move Evaluations */}
          {moveEvaluations.length > 0 && (
            <MoveEvaluator evaluations={moveEvaluations} board={board} />
          )}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <GameSettings onStart={startGame} onClose={() => setShowSettings(false)} />
        )}

        {/* Dataset Trainer Modal */}
        {showTrainer && (
          <DatasetTrainer 
            onModelTrained={updateMLWeights} 
            onClose={() => setShowTrainer(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
