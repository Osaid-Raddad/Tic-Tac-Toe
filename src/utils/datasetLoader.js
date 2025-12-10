/**
 * Dataset Loader for Tic-Tac-Toe Training Data
 */

/**
 * Parse CSV data from the dataset
 * @param {string} csvText - Raw CSV text
 * @returns {Object} - Parsed training data
 */
export const parseDataset = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  const features = [];
  const labels = [];
  
  // Parse each row (skip header)
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => parseFloat(v.trim()));
    
    if (values.length === headers.length) {
      // Extract features (all columns except last)
      const featureVector = values.slice(0, -1);
      // Extract label (last column)
      const label = values[values.length - 1];
      
      features.push(featureVector);
      labels.push(label);
    }
  }
  
  return {
    features,
    labels,
    headers: headers.slice(0, -1),
    sampleCount: features.length,
    featureCount: features[0].length
  };
};

/**
 * Load dataset from file
 * @param {File} file - CSV file object
 * @returns {Promise<Object>} - Parsed dataset
 */
export const loadDatasetFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const dataset = parseDataset(csvText);
        resolve(dataset);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Load dataset from URL (for bundled dataset)
 * @param {string} url - URL to CSV file
 * @returns {Promise<Object>} - Parsed dataset
 */
export const loadDatasetFromURL = async (url) => {
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    return parseDataset(csvText);
  } catch (error) {
    throw new Error(`Failed to load dataset: ${error.message}`);
  }
};

/**
 * Split dataset into training and testing sets
 * @param {Object} dataset - Full dataset
 * @param {number} testRatio - Ratio for test set (0-1)
 * @returns {Object} - Training and testing sets
 */
export const splitDataset = (dataset, testRatio = 0.2) => {
  const { features, labels } = dataset;
  const totalSamples = features.length;
  const testSize = Math.floor(totalSamples * testRatio);
  const trainSize = totalSamples - testSize;
  
  // Shuffle indices
  const indices = Array.from({ length: totalSamples }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // Split based on shuffled indices
  const trainFeatures = indices.slice(0, trainSize).map(i => features[i]);
  const trainLabels = indices.slice(0, trainSize).map(i => labels[i]);
  const testFeatures = indices.slice(trainSize).map(i => features[i]);
  const testLabels = indices.slice(trainSize).map(i => labels[i]);
  
  return {
    train: { features: trainFeatures, labels: trainLabels },
    test: { features: testFeatures, labels: testLabels }
  };
};

/**
 * Normalize features to [0, 1] range
 * @param {Array<Array<number>>} features - Feature matrix
 * @returns {Object} - Normalized features and normalization params
 */
export const normalizeFeatures = (features) => {
  const featureCount = features[0].length;
  const mins = new Array(featureCount).fill(Infinity);
  const maxs = new Array(featureCount).fill(-Infinity);
  
  // Find min and max for each feature
  features.forEach(sample => {
    sample.forEach((value, i) => {
      mins[i] = Math.min(mins[i], value);
      maxs[i] = Math.max(maxs[i], value);
    });
  });
  
  // Normalize
  const normalized = features.map(sample =>
    sample.map((value, i) => {
      const range = maxs[i] - mins[i];
      return range === 0 ? 0 : (value - mins[i]) / range;
    })
  );
  
  return { normalized, mins, maxs };
};

/**
 * Calculate dataset statistics
 * @param {Object} dataset - Dataset object
 * @returns {Object} - Statistics
 */
export const getDatasetStats = (dataset) => {
  const { features, labels } = dataset;
  
  const positiveCount = labels.filter(l => l === 1).length;
  const negativeCount = labels.filter(l => l === -1).length;
  
  const featureMeans = features[0].map((_, i) => {
    const sum = features.reduce((acc, sample) => acc + sample[i], 0);
    return sum / features.length;
  });
  
  return {
    totalSamples: features.length,
    positiveCount,
    negativeCount,
    balance: (positiveCount / features.length * 100).toFixed(1) + '%',
    featureMeans
  };
};
