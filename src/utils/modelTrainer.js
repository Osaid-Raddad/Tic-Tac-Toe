/**
 * Model Trainer for Tic-Tac-Toe ML Evaluation
 * Implements linear regression with gradient descent
 */

/**
 * Train linear regression model using gradient descent
 * @param {Array<Array<number>>} X - Feature matrix
 * @param {Array<number>} y - Labels
 * @param {Object} options - Training options
 * @returns {Object} - Trained weights and training history
 */
export const trainLinearModel = (X, y, options = {}) => {
  const {
    learningRate = 0.01,
    epochs = 1000,
    regularization = 0.001,
    verbose = false
  } = options;
  
  const m = X.length; // Number of samples
  const n = X[0].length; // Number of features
  
  // Initialize weights (including bias)
  let weights = new Array(n + 1).fill(0).map(() => Math.random() * 0.01);
  
  const history = {
    losses: [],
    accuracies: []
  };
  
  // Gradient descent
  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalLoss = 0;
    const gradients = new Array(n + 1).fill(0);
    
    // Forward pass and compute gradients
    for (let i = 0; i < m; i++) {
      // Prediction: y_pred = w0 + w1*x1 + w2*x2 + ... + wn*xn
      let prediction = weights[0]; // bias
      for (let j = 0; j < n; j++) {
        prediction += weights[j + 1] * X[i][j];
      }
      
      // Error
      const error = prediction - y[i];
      totalLoss += error * error;
      
      // Compute gradients
      gradients[0] += error; // bias gradient
      for (let j = 0; j < n; j++) {
        gradients[j + 1] += error * X[i][j];
      }
    }
    
    // Update weights with regularization
    for (let j = 0; j < weights.length; j++) {
      const gradient = gradients[j] / m;
      const regTerm = j > 0 ? regularization * weights[j] : 0; // Don't regularize bias
      weights[j] -= learningRate * (gradient + regTerm);
    }
    
    // Calculate metrics
    const loss = totalLoss / m;
    history.losses.push(loss);
    
    // Calculate accuracy
    if (epoch % 50 === 0) {
      const accuracy = calculateAccuracy(X, y, weights);
      history.accuracies.push({ epoch, accuracy });
      
      if (verbose) {
        console.log(`Epoch ${epoch}: Loss=${loss.toFixed(4)}, Accuracy=${accuracy.toFixed(2)}%`);
      }
    }
  }
  
  return {
    weights,
    bias: weights[0],
    featureWeights: weights.slice(1),
    history
  };
};

/**
 * Calculate prediction accuracy
 * @param {Array<Array<number>>} X - Features
 * @param {Array<number>} y - True labels
 * @param {Array<number>} weights - Model weights
 * @returns {number} - Accuracy percentage
 */
export const calculateAccuracy = (X, y, weights) => {
  let correct = 0;
  
  for (let i = 0; i < X.length; i++) {
    let prediction = weights[0]; // bias
    for (let j = 0; j < X[i].length; j++) {
      prediction += weights[j + 1] * X[i][j];
    }
    
    // Convert to binary classification (-1 or 1)
    const predicted = prediction >= 0 ? 1 : -1;
    if (predicted === y[i]) {
      correct++;
    }
  }
  
  return (correct / X.length) * 100;
};

/**
 * Make prediction using trained model
 * @param {Array<number>} features - Feature vector
 * @param {Array<number>} weights - Model weights
 * @returns {number} - Prediction score
 */
export const predict = (features, weights) => {
  let score = weights[0]; // bias
  for (let i = 0; i < features.length; i++) {
    score += weights[i + 1] * features[i];
  }
  return score;
};

/**
 * Cross-validation for model evaluation
 * @param {Array<Array<number>>} X - Features
 * @param {Array<number>} y - Labels
 * @param {number} folds - Number of folds
 * @param {Object} options - Training options
 * @returns {Object} - Cross-validation results
 */
export const crossValidate = (X, y, folds = 5, options = {}) => {
  const foldSize = Math.floor(X.length / folds);
  const accuracies = [];
  
  for (let i = 0; i < folds; i++) {
    const testStart = i * foldSize;
    const testEnd = (i + 1) * foldSize;
    
    // Split into train and test
    const trainX = [...X.slice(0, testStart), ...X.slice(testEnd)];
    const trainY = [...y.slice(0, testStart), ...y.slice(testEnd)];
    const testX = X.slice(testStart, testEnd);
    const testY = y.slice(testStart, testEnd);
    
    // Train model
    const { weights } = trainLinearModel(trainX, trainY, options);
    
    // Test model
    const accuracy = calculateAccuracy(testX, testY, weights);
    accuracies.push(accuracy);
  }
  
  const meanAccuracy = accuracies.reduce((a, b) => a + b, 0) / folds;
  const stdAccuracy = Math.sqrt(
    accuracies.reduce((sum, acc) => sum + Math.pow(acc - meanAccuracy, 2), 0) / folds
  );
  
  return {
    accuracies,
    meanAccuracy,
    stdAccuracy
  };
};

/**
 * Feature importance analysis
 * @param {Array<number>} weights - Trained feature weights
 * @param {Array<string>} featureNames - Names of features
 * @returns {Array<Object>} - Feature importance rankings
 */
export const analyzeFeatureImportance = (weights, featureNames) => {
  const featureWeights = weights.slice(1); // Skip bias
  
  const importance = featureWeights.map((weight, i) => ({
    feature: featureNames[i] || `Feature ${i + 1}`,
    weight: weight,
    absWeight: Math.abs(weight),
    impact: weight > 0 ? 'positive' : 'negative'
  }));
  
  // Sort by absolute weight
  importance.sort((a, b) => b.absWeight - a.absWeight);
  
  return importance;
};

/**
 * Export trained model to JSON
 * @param {Object} model - Trained model
 * @param {Array<string>} featureNames - Feature names
 * @returns {Object} - Exportable model
 */
export const exportModel = (model, featureNames) => {
  return {
    weights: model.weights,
    bias: model.bias,
    featureWeights: model.featureWeights,
    featureNames,
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
};

/**
 * Import model from JSON
 * @param {Object} modelJson - Exported model JSON
 * @returns {Object} - Model weights
 */
export const importModel = (modelJson) => {
  return {
    weights: modelJson.weights,
    bias: modelJson.bias,
    featureWeights: modelJson.featureWeights
  };
};
