const MoveEvaluator = ({ evaluations, board }) => {
  // Get position name for display
  const getPositionName = (index) => {
    const positions = [
      'Top Left', 'Top Center', 'Top Right',
      'Mid Left', 'Center', 'Mid Right',
      'Bot Left', 'Bot Center', 'Bot Right'
    ];
    return positions[index];
  };

  // Get score color
  const getScoreColor = (value) => {
    if (value > 50) return 'text-green-400';
    if (value > 20) return 'text-lime-400';
    if (value > 0) return 'text-yellow-400';
    if (value > -20) return 'text-orange-400';
    return 'text-red-400';
  };

  // Get bar color
  const getBarColor = (value) => {
    if (value > 50) return 'from-green-500 to-emerald-600';
    if (value > 20) return 'from-lime-500 to-green-600';
    if (value > 0) return 'from-yellow-500 to-orange-500';
    if (value > -20) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-600';
  };

  // Normalize score to percentage (for bar display)
  const normalizeScore = (value) => {
    // Assuming scores range from -100 to 100
    const normalized = ((value + 100) / 200) * 100;
    return Math.max(5, Math.min(100, normalized)); // Keep minimum 5% for visibility
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-md w-full">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📊</span> AI Move Analysis
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        AI's evaluation scores for possible moves (higher is better for AI)
      </p>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {evaluations.map(({ move, value }, index) => (
          <div
            key={move}
            className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-purple-400">
                  #{index + 1}
                </span>
                <div>
                  <p className="text-white font-semibold">{getPositionName(move)}</p>
                  <p className="text-xs text-gray-500">Position {move}</p>
                </div>
              </div>
              <span className={`text-xl font-bold ${getScoreColor(value)}`}>
                {value > 0 ? '+' : ''}{value.toFixed(1)}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-linear-to-r ${getBarColor(value)} transition-all duration-500 rounded-full shadow-lg`}
                style={{ width: `${normalizeScore(value)}%` }}
              />
            </div>

            {/* Mini Board Preview */}
            <div className="mt-3 grid grid-cols-3 gap-1">
              {board.map((cell, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${
                    i === move
                      ? 'bg-yellow-500 text-gray-900 animate-pulse'
                      : cell === 'X'
                      ? 'bg-blue-500/30 text-blue-300'
                      : cell === 'O'
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-gray-700/30 text-gray-600'
                  }`}
                >
                  {i === move ? '→' : cell}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 mb-2 font-semibold">Score Interpretation:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-linear-to-r from-green-500 to-emerald-600 rounded"></div>
            <span className="text-gray-400">Strong move</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-linear-to-r from-yellow-500 to-orange-500 rounded"></div>
            <span className="text-gray-400">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-linear-to-r from-red-500 to-rose-600 rounded"></div>
            <span className="text-gray-400">Weak move</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded animate-pulse"></div>
            <span className="text-gray-400">Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveEvaluator;
