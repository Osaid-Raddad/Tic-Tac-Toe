# 🎮 AI-Powered Tic-Tac-Toe with Machine Learning

An intelligent Tic-Tac-Toe game featuring advanced AI opponents, multiple difficulty levels, and continuous machine learning capabilities. Built with React, Vite, and TailwindCSS.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-38B2AC.svg)](https://tailwindcss.com/)

## 🌟 Key Features

### 🤖 **Dual AI Systems**
- **Classical Heuristic**: Rule-based AI using game theory and strategic patterns
- **Machine Learning**: Trained on 2,014+ real game outcomes with continuous learning

### 🎯 **Three Difficulty Levels**
- **Easy**: Beatable - AI makes intentional mistakes (50% random + 30% suboptimal moves)
- **Normal**: Challenging - Strategic play with occasional errors (15% suboptimal moves)
- **Hard**: Expert - Near-perfect play using full game tree search

### 📊 **Advanced Features**
- ⚡ **Alpha-Beta Pruning**: Optimized search reducing 97% of evaluated nodes
- 📈 **Live Move Evaluation**: Real-time scoring of all possible moves
- 🧠 **Continuous Learning**: AI learns from every game you play
- 💾 **Persistent Storage**: Settings and trained models saved in browser
- 📉 **Training Metrics**: View accuracy, feature importance, and model weights

---

## 🏗️ Project Structure

```
tic-tac-toe/
├── public/
│   └── tictactoe_dataset.csv    # Training dataset (2,014 games)
├── src/
│   ├── components/
│   │   ├── TicTacToe.jsx        # Main game component
│   │   ├── GameSettings.jsx     # Settings modal
│   │   ├── MoveEvaluator.jsx    # AI move analysis panel
│   │   └── DatasetTrainer.jsx   # ML training interface
│   ├── utils/
│   │   ├── gameLogic.js         # Core game rules & mechanics
│   │   ├── alphaBeta.js         # Alpha-Beta pruning algorithm
│   │   ├── classicalEval.js     # Heuristic evaluation function
│   │   ├── mlEval.js            # ML-based evaluation
│   │   ├── featureExtractor.js  # Feature engineering for ML
│   │   ├── modelTrainer.js      # Gradient descent training
│   │   ├── datasetLoader.js     # CSV dataset management
│   │   └── gameHistory.js       # Continuous learning system
│   ├── App.jsx                  # Main app
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── UTILS_EXPLANATION.md         # Detailed technical documentation
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Tic-Tac-Toe
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🎮 How to Play

### 1. **Configure Settings**
- Choose your symbol (X or O)
- Select difficulty (Easy/Normal/Hard)
- Choose AI evaluation method (Classical Heuristic or Machine Learning)

### 2. **Play the Game**
- Click on empty cells to make your move
- AI will respond automatically
- Watch the Move Evaluator panel for AI's scoring of each position

### 3. **Train the ML Model** (Optional)
- Click "🤖 Train Model" button
- View training progress and accuracy metrics
- Click "Use This Model" to activate trained weights
- AI will now use your trained model!

### 4. **Continuous Learning**
- Every game you play is automatically saved
- Click "Train Model" again to retrain with your played games
- The more you play, the more data the AI has to learn from!

---

## 🧠 AI Implementation Details

### **Alpha-Beta Pruning Algorithm**

The AI uses the minimax algorithm with alpha-beta pruning for optimal move selection:

```
Minimax evaluates: "If I move here, what's the best my opponent can do?"
Alpha-Beta skips branches that won't affect the final decision

Time Complexity:
- Full Minimax: O(b^d) ≈ 550,000 nodes (depth 9)
- Alpha-Beta: O(b^(d/2)) ≈ 18,000 nodes (97% reduction!)
```

**Search Depths by Difficulty:**
- Easy: Depth 1 (looks 1 move ahead)
- Normal: Depth 3 (plans 3 moves ahead)  
- Hard: Depth 9 (complete game tree - perfect play)

### **Classical Heuristic Evaluation**

Strategic rules based on human game theory:

| Priority | Feature | Score | Reasoning |
|----------|---------|-------|-----------|
| 1st | Immediate Win | +500 | Take winning move |
| 2nd | Block Opponent Win | +600 | Must prevent loss |
| 3rd | Create Fork | +300 | Two winning threats |
| 4th | Block Fork | +400 | Stop opponent's fork |
| 5th | Center Control | +40 | Most strategic position |
| 6th | Corner Control | +20 | Second-best positions |
| 7th | Build Lines | +10-50 | Progress toward win |

### **Machine Learning Evaluation**

**Training Algorithm**: Linear Regression with Gradient Descent

**Features Extracted** (6 features per board state):
1. **X Count**: Number of X marks (0-9)
2. **O Count**: Number of O marks (0-9)
3. **X Almost Win**: Lines with 2 X's + 1 empty (0-8)
4. **O Almost Win**: Lines with 2 O's + 1 empty (0-8)
5. **X Center**: Binary - X in center position (0 or 1)
6. **X Corners**: Corners controlled by X (0-4)

**Prediction Formula**:
```
Score = bias + w₁×f₁ + w₂×f₂ + w₃×f₃ + w₄×f₄ + w₅×f₅ + w₆×f₆

Where:
- bias: Base prediction value
- wᵢ: Learned weights (feature importance)
- fᵢ: Extracted features from board
```

**Training Process**:
1. Load 2,014 historical games from CSV
2. Add your played games (continuous learning)
3. Normalize features (mean=0, std=1)
4. Split 80% training, 20% testing
5. Run 3,000 epochs of gradient descent
6. Evaluate accuracy on test set

**Expected Performance**:
- Training Accuracy: 80-88%
- Test Accuracy: 80-88%
- *Note: Limited by dataset imbalance (68% X wins, 32% O wins)*

---

## 📊 Dataset Information

**File**: `public/tictactoe_dataset.csv`
**Format**: CSV with 6 features + 1 label
**Samples**: 2,014 completed games
**Source**: Historical game outcomes

**Label Distribution**:
- X Wins (+1): 1,369 games (68%)
- O Wins (-1): 644 games (32%)
- Draw: Not included (only decisive games)

**CSV Structure**:
```csv
f1_X_count,f2_O_count,f3_X_almost_win,f4_O_almost_win,f5_X_center,f6_X_corners,label
1,0,0,0,0,0,1
2,1,1,0,0,0,1
...
```

---

## 🎯 Gameplay Strategy Tips

### **To Beat Normal Mode:**

#### **Corner Fork Strategy** (Most Reliable)
1. Take a corner (position 0, 2, 6, or 8)
2. If AI takes center, take opposite corner
3. Take another corner to create a fork (two winning threats)
4. AI can only block one - you win!

#### **Center Control Strategy**
1. Take the center (position 4)
2. If AI takes a corner, take the opposite corner
3. Create fork opportunities

### **Key Tactics**:
- ✅ Control center (most strategic)
- ✅ Take corners (second best)
- ✅ Create forks (force AI to choose)
- ✅ Think 3-4 moves ahead
- ❌ Avoid edges (weakest positions)

---

## 🛠️ Technical Stack

### **Frontend**
- **React 18.3.1**: Component-based UI
- **Vite 6.0.1**: Fast build tool and dev server
- **TailwindCSS 4.1.17**: Utility-first CSS framework
- **React Toastify 11.0.5**: Toast notifications

### **AI & Machine Learning**
- **Custom Alpha-Beta Implementation**: Game tree search
- **Gradient Descent**: Training algorithm (from scratch)
- **Linear Regression**: ML model (no external ML libraries!)
- **Feature Engineering**: Custom feature extraction

### **Data Persistence**
- **localStorage**: Model weights, game history, settings
- **CSV Dataset**: 2,014 pre-labeled games

---

## 🎨 UI Features

### **Visual Design**
- 🎨 Modern gradient backgrounds
- 🌈 Color-coded moves (blue for X, purple for O)
- ✨ Smooth animations and transitions
- 🏆 Winning line highlighting (green gradient)
- 📱 Fully responsive (mobile-friendly)

### **Interactive Elements**
- 🎮 Click cells to make moves
- 👁️ Live move evaluator panel
- ⚙️ Collapsible settings modal
- 📊 Training metrics display
- 🔄 Reset game button
- 🔧 Reset settings button
- 🗑️ Reset ML model button

### **Toast Notifications**
- 🎉 Win/Loss messages
- ℹ️ Training progress updates
- ✅ Model activation confirmations
- ⚠️ Game state changes

---

## 📁 Key Files Explained

### **Core Game Files**

#### `src/utils/gameLogic.js`
- Board representation (flat 9-element array)
- Legal move generation
- Win detection (8 patterns: 3 rows, 3 cols, 2 diagonals)
- Terminal state checking

#### `src/utils/alphaBeta.js`
- Alpha-Beta pruning implementation
- Minimax search with depth limiting
- Move evaluation for all legal moves
- Difficulty-based randomness injection

#### `src/utils/classicalEval.js`
- Hand-crafted strategic heuristics
- Priority-based scoring system
- Human-like strategic thinking
- Depth settings for each difficulty

### **Machine Learning Files**

#### `src/utils/mlEval.js`
- ML-based board evaluation
- Feature normalization support
- Perspective flipping (X vs O)
- Model weight management

#### `src/utils/featureExtractor.js`
- Extracts 6 features from board state
- Matches CSV dataset format exactly
- Counts threats and strategic positions
- Used for both training and prediction

#### `src/utils/modelTrainer.js`
- Gradient descent implementation
- Loss calculation (MSE)
- Accuracy metrics
- Feature importance analysis
- L2 regularization

#### `src/utils/datasetLoader.js`
- CSV parsing
- Train/test splitting (80/20)
- Dataset statistics
- Data validation

#### `src/utils/gameHistory.js`
- Saves completed games
- Continuous learning support
- localStorage management
- Limits to 500 recent games

### **React Components**

#### `src/components/TicTacToe.jsx`
- Main game logic and state management
- Handles human and AI moves
- Integrates all utilities
- Settings persistence

#### `src/components/GameSettings.jsx`
- Settings modal UI
- Player selection
- Difficulty configuration
- Evaluation method selection

#### `src/components/MoveEvaluator.jsx`
- Displays AI's move scores
- Color-coded evaluation values
- Real-time updates
- Always visible panel

#### `src/components/DatasetTrainer.jsx`
- ML training interface
- Progress indicators
- Accuracy display
- Feature importance visualization
- Model reset functionality

---

## 🔬 Advanced Topics

### **Why Alpha-Beta Pruning?**
Without pruning, the AI would evaluate 550,000+ game states for depth 9. Alpha-Beta reduces this to ~18,000 (97% reduction) while guaranteeing the same optimal move.

### **Why Linear Regression?**
- Simple and interpretable
- Fast training and prediction
- Works well for this problem size
- No external ML libraries needed
- Educational value (implemented from scratch)

### **Why Feature Normalization?**
Without normalization, features with larger scales (like mark counts 0-9) would dominate over binary features (center 0-1). Normalization ensures all features contribute equally to learning.

### **Why Imbalanced Dataset?**
Real Tic-Tac-Toe games naturally favor X (who moves first). The 68/32 split reflects actual game dynamics. Perfect balance would require artificial sampling.

### **Why 500 Game Limit?**
Trade-off between:
- Storage space (localStorage ~5MB limit)
- Training time (more data = slower)
- Recency (recent games more relevant)
- Impact (500 games ≈ 20% influence on model)

---

## 🐛 Troubleshooting

### **Training Accuracy Still 69-72%?**
1. Make sure you refreshed the browser (Ctrl + F5)
2. Click "Reset Model" to clear old weights
3. Retrain the model
4. Expected: 80-88% after normalization updates

### **ML Model Not Learning?**
- Play at least 10-20 games first
- Click "Train Model" to retrain
- One game has minimal impact (~0.05%)
- Need many examples to see improvement

### **AI Too Hard on Easy Mode?**
- Easy mode has 50% random + 30% suboptimal moves
- Some games it might still win
- Overall win rate should be ~70-80% for human

### **Settings Reset on Page Refresh?**
- Settings should persist in localStorage
- Check if localStorage is enabled in browser
- Try "Reset Settings" button to re-initialize

---

## 📚 Learning Resources

### **Algorithms**
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax)
- [Alpha-Beta Pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
- [Game Tree Search](https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-1-introduction/)

### **Machine Learning**
- [Linear Regression](https://en.wikipedia.org/wiki/Linear_regression)
- [Gradient Descent](https://en.wikipedia.org/wiki/Gradient_descent)
- [Feature Engineering](https://en.wikipedia.org/wiki/Feature_engineering)
- [Feature Normalization](https://en.wikipedia.org/wiki/Feature_scaling)

### **Game Theory**
- [Tic-Tac-Toe Strategy](https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy)
- [Zero-Sum Games](https://en.wikipedia.org/wiki/Zero-sum_game)

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Add neural network evaluation (vs linear regression)
- [ ] Implement MCTS (Monte Carlo Tree Search)
- [ ] Add game replay feature
- [ ] Export/import trained models
- [ ] Multiplayer mode (two humans)
- [ ] Tournament mode (test different strategies)
- [ ] Visualization of search tree
- [ ] Performance profiling
- [ ] Unit tests for utilities

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👨‍💻 Author

Created as an AI and Machine Learning educational project.

**Tech Highlights**:
- ✅ Implemented classic AI algorithms from scratch
- ✅ Built ML training pipeline without external ML libraries
- ✅ Demonstrated continuous learning system
- ✅ Combined traditional AI with modern ML approaches

---

## 📞 Support

For detailed technical documentation, see [UTILS_EXPLANATION.md](./UTILS_EXPLANATION.md)

For questions or issues:
1. Check the troubleshooting section above
2. Review the technical documentation
3. Examine the code comments (extensively documented)

---

## 🎓 Educational Value

This project demonstrates:

### **Computer Science Concepts**
- Game tree search algorithms
- Algorithm optimization (pruning)
- Time/space complexity analysis
- Recursive algorithms
- State space representation

### **Artificial Intelligence**
- Minimax decision making
- Heuristic evaluation functions
- Search depth vs performance trade-offs
- Alpha-Beta pruning optimization

### **Machine Learning**
- Supervised learning
- Feature engineering
- Gradient descent optimization
- Model training and evaluation
- Overfitting prevention (regularization)
- Data normalization

### **Software Engineering**
- Modular architecture
- Component-based design
- State management
- Data persistence
- Responsive UI design

---

**Made with ❤️ and lots of ☕**
  - Blue gradient for X
  - Purple gradient for O
  - Green gradient for winning line
- **Responsive design** (mobile, tablet, desktop)
- **Visual feedback** with hover effects and scaling

### Move Evaluation Display
- Shows all possible moves ranked by AI evaluation
- Visual score bars with color coding:
  - 🟢 Green: Strong moves (>50)
  - 🟡 Yellow: Neutral moves (0-20)
  - 🔴 Red: Weak moves (<-20)
- Mini board preview showing move position
- Real-time score updates

## 🚀 How to Run

1. **Install dependencies** (if not already installed):
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open browser** to the URL shown (usually `http://localhost:5173`)

## 🎮 How to Play

1. **Game starts** with settings modal:
   - Choose your symbol (X or O)
   - Select difficulty level
   - Pick evaluation function type
   - Click "Start Game"

2. **Make your move**:
   - Click any empty cell on the board
   - AI will respond automatically
   - View AI's evaluation scores (toggle with "Show/Hide Scores")

3. **Game controls**:
   - **Reset Game**: Start new game with same settings
   - **Settings**: Open settings to change configuration
   - **Show/Hide Scores**: Toggle move evaluation display

## 🧠 AI Algorithm Details

### Alpha-Beta Pruning
```javascript
alphaBetaSearch(board, depth, alpha, beta, isMaximizing, aiPlayer, evalFunc, maxDepth)
```

**How it works**:
1. Explores game tree using minimax
2. Prunes branches that won't affect final decision
3. Uses evaluation function at depth limit
4. Returns best move with its score

**Optimizations**:
- Depth-limited search based on difficulty
- Early termination on terminal states
- Prefer faster wins / slower losses

### Evaluation Function Comparison

| Feature | Classical | ML Basic | ML Advanced |
|---------|-----------|----------|-------------|
| Approach | Hand-coded rules | Linear model | Non-linear model |
| Center weight | +8 | +6.0 | Dynamic |
| Two-in-row | +15 | +18.0 | +20 |
| Block opponent | -20 | -22.0 | -25 |
| Fork detection | +25 | Implicit | +20 |
| Computation | Fast | Fast | Moderate |

## 📊 Feature Extraction (ML)

```javascript
extractFeatures(board, player) → {
  playerMarks: number,
  opponentMarks: number,
  playerTwoInRow: number,      // About to win
  opponentTwoInRow: number,    // Must block
  playerOneInRow: number,      // Potential lines
  opponentOneInRow: number,
  centerControl: -1|0|1,
  playerCorners: number,
  opponentCorners: number
}
```

## 🎓 Educational Value

This implementation demonstrates:
- **Game theory**: Minimax with Alpha-Beta pruning
- **AI search algorithms**: Depth-limited search, move ordering
- **Evaluation functions**: Both heuristic and ML-based
- **React best practices**: Hooks, state management, component composition
- **Modern UI/UX**: Responsive design, animations, user feedback

## 🔧 Customization

### Adjust AI Difficulty
Edit `classicalEval.js` or `mlEval.js`:
```javascript
export const getClassicalDepth = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 2;    // Change these values
    case 'normal': return 4;
    case 'hard': return 9;
  }
};
```

### Modify Evaluation Weights
Edit `mlEval.js`:
```javascript
const TRAINED_WEIGHTS = {
  playerTwoInRow: 18.0,  // Adjust weights
  opponentTwoInRow: -22.0,
  // ... more weights
};
```

### Change Colors
Edit Tailwind classes in components:
```jsx
// From blue/purple theme
className="from-blue-500 to-cyan-500"

// To red/orange theme
className="from-red-500 to-orange-500"
```

## 📈 Performance

- **Average moves per game**: 5-9
- **AI response time**: 200-600ms
- **Search depth (hard mode)**: Full game tree
- **Positions evaluated**: ~5,000 (hard mode)

## 🐛 Troubleshooting

**Issue**: AI not responding
- **Solution**: Check browser console for errors

**Issue**: Gradients not showing
- **Solution**: Ensure Tailwind CSS v4 is properly configured

**Issue**: Toast notifications not appearing
- **Solution**: Verify react-toastify is imported in App.jsx

## 📝 Next Steps / Enhancements

Potential improvements:
1. **Multiplayer mode** (human vs human)
2. **Game history replay**
3. **Statistics tracking** (wins/losses/draws)
4. **Sound effects**
5. **Different board sizes** (4×4, 5×5)
6. **Save/Load games**
7. **Neural network evaluation** (replace linear model)
8. **Opening book** for faster early moves

## 📚 Technical Stack

- **React 18.3.1** - UI framework
- **Vite 6.0.1** - Build tool
- **Tailwind CSS 4.1.17** - Styling
- **React Toastify 11.0.5** - Notifications
- **JavaScript (ES6+)** - Programming language

## 🎉 Conclusion

This Tic-Tac-Toe implementation showcases a complete AI game with:
- Multiple difficulty levels
- Two evaluation approaches (classical and ML)
- Professional UI/UX design
- Educational code structure
- Extensible architecture

Perfect for learning AI algorithms, React development, and game design patterns!
