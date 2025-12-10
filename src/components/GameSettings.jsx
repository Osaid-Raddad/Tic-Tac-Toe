import { useState } from 'react';

const GameSettings = ({ onStart, onClose }) => {
  const [humanPlayer, setHumanPlayer] = useState('X');
  const [difficulty, setDifficulty] = useState('normal');
  const [evaluationType, setEvaluationType] = useState('classical');

  const handleStart = () => {
    const config = {
      humanPlayer,
      aiPlayer: humanPlayer === 'X' ? 'O' : 'X',
      difficulty,
      evaluationType,
    };
    onStart(config);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-purple-500/30 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">⚙️ Game Settings</h2>
          <p className="text-gray-400">Configure your game preferences</p>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Player Selection */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-3">
              Choose Your Symbol
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHumanPlayer('X')}
                className={`py-4 px-6 rounded-xl font-bold text-2xl transition-all duration-300 ${
                  humanPlayer === 'X'
                    ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                ❌ X
              </button>
              <button
                onClick={() => setHumanPlayer('O')}
                className={`py-4 px-6 rounded-xl font-bold text-2xl transition-all duration-300 ${
                  humanPlayer === 'O'
                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                ⭕ O
              </button>
            </div>
            {humanPlayer === 'O' && (
              <p className="text-xs text-yellow-400 mt-2">⚠️ AI will move first</p>
            )}
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-3">
              Difficulty Level
            </label>
            <div className="space-y-2">
              {['easy', 'normal', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-between ${
                    difficulty === level
                      ? 'bg-linear-to-r from-green-500 to-teal-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="capitalize">
                    {level === 'easy' && '😊 Easy'}
                    {level === 'normal' && '😐 Normal'}
                    {level === 'hard' && '😈 Hard'}
                  </span>
                  {difficulty === level && <span>✓</span>}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-400 space-y-1">
              <p>🟢 <span className="font-semibold">Easy:</span> AI makes occasional mistakes</p>
              <p>🟡 <span className="font-semibold">Normal:</span> Balanced gameplay</p>
              <p>🔴 <span className="font-semibold">Hard:</span> Perfect play, unbeatable!</p>
            </div>
          </div>

          {/* Evaluation Function Selection */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-3">
              AI Evaluation Method
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setEvaluationType('classical')}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-left ${
                  evaluationType === 'classical'
                    ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>🧠 Classical Heuristic</span>
                  {evaluationType === 'classical' && <span>✓</span>}
                </div>
                <p className="text-xs mt-1 opacity-80">Hand-coded strategic rules</p>
              </button>

              <button
                onClick={() => setEvaluationType('ml-basic')}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-left ${
                  evaluationType === 'ml-basic'
                    ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>🤖 Machine Learning</span>
                  {evaluationType === 'ml-basic' && <span>✓</span>}
                </div>
                <p className="text-xs mt-1 opacity-80">Feature-based trained model</p>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="flex-1 py-3 px-6 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            🎮 Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSettings;
