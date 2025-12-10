import { useState } from 'react';
import { loadDatasetFromURL, splitDataset, getDatasetStats } from '../utils/datasetLoader';
import { trainLinearModel, calculateAccuracy, analyzeFeatureImportance } from '../utils/modelTrainer';
import { toast } from 'react-toastify';

const DatasetTrainer = ({ onModelTrained, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [trained, setTrained] = useState(false);
  const [trainingResults, setTrainingResults] = useState(null);
  const [datasetStats, setDatasetStats] = useState(null);

  const handleTrainModel = async () => {
    setLoading(true);
    
    try {
      // Load the bundled dataset
      toast.info('Loading dataset...');
      const dataset = await loadDatasetFromURL('/tictactoe_dataset.csv');
      
      // Get dataset statistics
      const stats = getDatasetStats(dataset);
      setDatasetStats(stats);
      
      // Split into train and test
      const { train, test } = splitDataset(dataset, 0.2);
      
      toast.info(`Training on ${train.features.length} samples...`);
      
      // Train the model
      const model = trainLinearModel(train.features, train.labels, {
        learningRate: 0.01,
        epochs: 1000,
        regularization: 0.001,
        verbose: false
      });
      
      // Test the model
      const trainAccuracy = calculateAccuracy(train.features, train.labels, model.weights);
      const testAccuracy = calculateAccuracy(test.features, test.labels, model.weights);
      
      // Analyze feature importance
      const featureImportance = analyzeFeatureImportance(model.weights, dataset.headers);
      
      const results = {
        model,
        trainAccuracy,
        testAccuracy,
        featureImportance,
        trainingSize: train.features.length,
        testingSize: test.features.length
      };
      
      setTrainingResults(results);
      setTrained(true);
      
      toast.success(`Model trained! Test accuracy: ${testAccuracy.toFixed(1)}%`);
      
    } catch (error) {
      console.error('Training error:', error);
      toast.error('Failed to train model: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseModel = () => {
    if (trainingResults) {
      onModelTrained(trainingResults.model);
      toast.success('Model activated! AI now uses trained weights.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 border-2 border-cyan-500/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">🤖 Train ML Model</h2>
          <p className="text-gray-400">Train the AI using the Tic-Tac-Toe dataset</p>
        </div>

        {/* Dataset Info */}
        {datasetStats && (
          <div className="mb-6 bg-gray-800/50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">📊 Dataset Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Total Samples</p>
                <p className="text-white font-bold text-xl">{datasetStats.totalSamples}</p>
              </div>
              <div>
                <p className="text-gray-400">Class Balance</p>
                <p className="text-white font-bold text-xl">{datasetStats.balance}</p>
              </div>
              <div>
                <p className="text-gray-400">Positive (X wins)</p>
                <p className="text-green-400 font-bold">{datasetStats.positiveCount}</p>
              </div>
              <div>
                <p className="text-gray-400">Negative (O wins)</p>
                <p className="text-red-400 font-bold">{datasetStats.negativeCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Training Results */}
        {trained && trainingResults && (
          <div className="space-y-4 mb-6">
            {/* Accuracy */}
            <div className="bg-gray-800/50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Training Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Training Accuracy</p>
                  <p className="text-white font-bold text-2xl">{trainingResults.trainAccuracy.toFixed(1)}%</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-linear-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${trainingResults.trainAccuracy}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Test Accuracy</p>
                  <p className="text-white font-bold text-2xl">{trainingResults.testAccuracy.toFixed(1)}%</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-linear-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${trainingResults.testAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="bg-gray-800/50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">📈 Feature Importance</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {trainingResults.featureImportance.map((feat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{feat.feature}</span>
                    <div className="flex items-center gap-2">
                      <span className={feat.weight > 0 ? 'text-green-400' : 'text-red-400'}>
                        {feat.weight.toFixed(3)}
                      </span>
                      <div className="w-20 bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${feat.weight > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${(feat.absWeight / trainingResults.featureImportance[0].absWeight) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Weights */}
            <div className="bg-gray-800/50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">⚖️ Model Weights</h3>
              <div className="text-xs text-gray-400 font-mono bg-gray-900 p-3 rounded overflow-x-auto">
                <p>Bias: {trainingResults.model.bias.toFixed(4)}</p>
                <p>Weights: [{trainingResults.model.featureWeights.map(w => w.toFixed(3)).join(', ')}]</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
          
          {!trained ? (
            <button
              onClick={handleTrainModel}
              disabled={loading}
              className="flex-1 py-3 px-6 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Training...' : '🚀 Train Model'}
            </button>
          ) : (
            <button
              onClick={handleUseModel}
              className="flex-1 py-3 px-6 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              ✨ Use This Model
            </button>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Training uses gradient descent with L2 regularization</p>
          <p>Dataset: {datasetStats?.totalSamples || '2014'} game outcomes</p>
        </div>
      </div>
    </div>
  );
};

export default DatasetTrainer;
