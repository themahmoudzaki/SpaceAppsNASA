# Exoplanet Classification System
## NASA Space Apps Competition

A stacked ensemble machine learning system for classifying exoplanets using data from Kepler, K2, and TESS missions.

---

## 🚀 Overview

This project implements a state-of-the-art stacked ensemble model combining:
- **XGBoost** - Gradient boosting decision trees
- **LightGBM** - High-performance gradient boosting
- **MLP** - Multi-Layer Perceptron neural network

The models are stacked using a neural network meta-model for superior prediction accuracy.

---

## 📁 Project Structure

```
├── src/
│   ├── data/
│   │   ├── data_loader_and_merger.py      # Load & merge datasets
│   │   ├── data_preprocessor_improved.py  # Enhanced preprocessing
│   │   └── data_visualizer.py             # Data visualization
│   ├── models/
│   │   └── model_trainer.py               # Stacked ensemble 
│   └── utils/
│       ├── entity.py                      # Data structures
│       └── common.py                      # Utility functions
├── data/
│   ├── kepler_captured_data.csv           # Kepler mission data
│   ├── K2_mission_captured_data.csv       # K2 mission data
│   ├── TESS_mission_captured_data.csv     # TESS mission data
│   └── processed/                         # Processed datasets
├── models/                                # Saved models
├── reports/
│   ├── logs/                              # Training logs
│   └── figures/                           # Visualizations
├── main_improved.py                       # Main execution script
```

---

This will:
1. Load and merge Kepler, K2, and TESS datasets
2. Generate visualizations
3. Preprocess data (imputation, scaling, splitting)
4. Train XGBoost base model
5. Train LightGBM base model
6. Train MLP base model
7. Generate meta-features from base models
8. Train neural network meta-model
9. Evaluate on test set
10. Save all models in TensorFlow SavedModel format


## 🧪 Model Architecture

### Base Models (Level 0)

**1. XGBoost Classifier**
- Estimators: 1024 trees
- Max depth: 8
- Learning rate: 0.01
- Subsample: 0.8
- Early stopping: 50 rounds

**2. LightGBM Classifier**
- Estimators: 1024 trees
- Max depth: 8
- Learning rate: 0.01
- Num leaves: 31
- Early stopping: 50 rounds

**3. MLP Neural Network**
- Layer 1: 256 neurons + BatchNorm + Dropout(0.3)
- Layer 2: 128 neurons + BatchNorm + Dropout(0.3)
- Layer 3: 64 neurons + BatchNorm + Dropout(0.2)
- Layer 4: 32 neurons + Dropout(0.2)
- Output: 3 classes (softmax)

### Meta-Model (Level 1)

**Neural Network Meta-Learner**
- Input: 9 features (3 probability vectors from base models)
- Layer 1: 64 neurons + BatchNorm + Dropout(0.3)
- Layer 2: 32 neurons + Dropout(0.2)
- Output: 3 classes (softmax)

---

## 📈 Expected Performance

Based on the research paper and implementation:

| Metric | Expected Range |
|--------|----------------|
| Accuracy | 82-84% |
| Precision | 83-85% |
| Recall | 78-81% |
| F1-Score | 81-83% |

### Comparison with Single Models

| Model | Accuracy (Paper) | Our Stacked Ensemble |
|-------|------------------|----------------------|
| Adaboost | 82.52% | - |
| Random Forest | 82.64% | - |
| **Stacking** | **83.08%** | **~83%** |

---

## 🔍 Data Preprocessing Details

### Missing Value Handling

1. **Target Variable**: Rows with missing disposition are removed
2. **Numeric Features**: KNN imputation (k=5, distance-weighted)
3. **Categorical Features**: Mode imputation

### Outlier Removal

- Method: Z-score based detection
- Threshold: 3.5 standard deviations
- Applied to: All numeric features except target

### Feature Scaling

- Method: StandardScaler (zero mean, unit variance)
- Applied to: All features before model training

### Data Splitting

- Training: 70%
- Test: 15%
- Cross-validation: 15%
- Stratified to maintain class distribution

---

## 🎓 Class Labels

| Label | Description | Encoding |
|-------|-------------|----------|
| FALSE_POSITIVE | Not an exoplanet | 0 |
| CANDIDATE | Potential exoplanet | 1 |
| CONFIRMED | Verified exoplanet | 2 |

---

## 📦 Model Outputs

After training, the following files are saved in `models/`:

```
models/
├── feature_scaler.pkl                      # StandardScaler
├── xgboost_model.pkl                       # XGBoost model
├── lightgbm_model.pkl                      # LightGBM model
├── mlp_model_savedmodel/                   # MLP TensorFlow SavedModel
│   ├── saved_model.pb
│   ├── variables/
│   └── assets/
├── stacked_ensemble_savedmodel/            # Meta-model SavedModel
│   ├── saved_model.pb
│   ├── variables/
│   └── assets/
└── complete_inference_model/               # Full pipeline SavedModel
    ├── saved_model.pb
    ├── variables/
    └── assets/
```

---

### Model Training

Hyperparameters can be adjusted in `model_trainer.py`:
- Number of estimators
- Learning rates
- Network architecture
- Dropout rates
- Batch sizes

---

## 📊 Logging & Monitoring

All training progress is logged to:
- Console output (real-time)
- Log files in `reports/logs/`

Example logs:
```
2024-10-07 14:23:15 - ModelTrainer - INFO - Training XGBoost model...
2024-10-07 14:25:42 - ModelTrainer - INFO - XGBoost Train Accuracy: 0.9234
2024-10-07 14:25:42 - ModelTrainer - INFO - XGBoost CV Accuracy: 0.8567
```

---

## 🐛 Troubleshooting

### Memory Issues
If you encounter memory errors:
- Reduce batch size in MLP training
- Reduce number of estimators in XGBoost/LightGBM
- Use a smaller subset of data for initial testing

### GPU Not Detected
TensorFlow should automatically detect GPU. To verify:
```python
import tensorflow as tf
print(tf.config.list_physical_devices('GPU'))
```

### Model Loading Errors
Ensure all model files are present in the `models/` directory:
- feature_scaler.pkl
- xgboost_model.pkl
- lightgbm_model.pkl
- mlp_model_savedmodel/
- stacked_ensemble_savedmodel/

---

## 📚 References

1. Luz, T.S.F., Braga, R.A.S., Ribeiro, E.R. (2024). "Assessment of Ensemble-Based Machine Learning Algorithms for Exoplanet Identification." Electronics 2024, 13, 3950.

2. NASA Exoplanet Archive: https://exoplanetarchive.ipac.caltech.edu/

3. Kepler Mission: https://www.nasa.gov/mission_pages/kepler/

---

## 🏆 Competition Submission

This system is designed for the NASA Space Apps Competition. Key highlights:

✅ Multi-mission data integration (Kepler, K2, TESS)  
✅ State-of-the-art ensemble learning  
✅ Production-ready model format  
✅ Comprehensive evaluation metrics  
✅ Reproducible results (fixed random seeds)  
✅ Extensive logging and visualization  

---

## 🙏 Acknowledgments

- NASA for providing exoplanet datasets
- NASA Space Apps Competition organizers
- Research paper authors for ensemble learning insights