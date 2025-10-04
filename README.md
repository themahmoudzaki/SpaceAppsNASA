# 🌌 ExoPlanet Hunter AI - Machine Learning Core

**ML Pipeline for NASA Space Apps Challenge 2025 - Exo X Hunter**

## 🚀 Overview

The **Machine Learning Core** is the intelligent engine behind Exo X Hunter, implementing a sophisticated **stacked ensemble approach** to classify exoplanet candidates from NASA's Kepler, K2, and TESS mission data. This system combines multiple machine learning models to achieve superior classification accuracy for exoplanet discovery.

---

## 🏗️ System Architecture

### Data Pipeline
```
NASA Mission Data → Data Loading & Merging → Preprocessing & Feature Engineering → Model Training → Ensemble Prediction
     (Kepler, K2, TESS)          │                     │                      │              │
                                  │                     │                      │              │
                           Standardized Features  Derived Features     XGBoost + LightGBM + MLP   Stacked Ensemble
```

### Model Stack
- **Base Models**: XGBoost, LightGBM, Neural Network (MLP)
- **Meta-Model**: Neural Network combining base model predictions
- **Optimization**: Automated hyperparameter tuning with Optuna

---

## 📊 Dataset Information

### Sources
- **Kepler Mission Data**
- **K2 Mission Data** 
- **TESS Mission Data**

### Key Features Processed
| Feature | Description | Importance |
|---------|-------------|------------|
| `period` | Orbital period | High |
| `duration` | Transit duration | High |
| `depth` | Transit depth | High |
| `planet_radius` | Planetary radius | Medium |
| `star_radius` | Stellar radius | Medium |
| `teff` | Stellar temperature | Medium |
| `semi_major_axis` | Orbital distance | Low |

### Target Classes
```python
class Disposition(IntEnum):
    FALSE_POSITIVE = 0    # Not an exoplanet
    CANDIDATE = 1         # Potential exoplanet
    CONFIRMED = 2         # Verified exoplanet
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+
- Required packages in `requirements.txt`

### Quick Start
```bash

# Install dependencies
pip install -r requirements.txt

# Run the complete ML pipeline
python src/main.py
```

### Environment Setup
```bash
# Create and activate virtual environment
python -m venv exohunter_env
source exohunter_env/bin/activate  # Linux/Mac
# OR
exohunter_env\Scripts\activate    # Windows

# Install packages
pip install -r requirements.txt
```

---

## 🛠️ Core Components

### 1. Data Loading & Merging (`data_loader_and_merger.py`)
- **Purpose**: Load and standardize data from multiple NASA missions
- **Key Features**:
  - Automatic column name mapping across datasets
  - Source identification and tracking
  - Data validation and error handling

```python
# Example usage
data_loader = ExoPlanetData(
    kepler_path="data/Kepler_captured_data.csv",
    k2_path="data/K2_mission_captured_data.csv", 
    tess_path="data/TESS_mission_captured_data.csv"
)
merged_data = data_loader.merge_data()
```

### 2. Data Preprocessing (`data_preprocessor.py`)
- **Purpose**: Clean, impute, and engineer features
- **Key Features**:
  - Smart missing value imputation (KNN/Median)
  - Advanced feature engineering
  - Data sanitization and validation

```python
# Derived Features Created:
- transit_signal_strength
- radius_ratio  
- transit_probability
- orbital_velocity
- stellar_flux
- habitable_zone_proxy
- logarithmic transformations
```

### 3. Hyperparameter Optimization (`hyperparameter_tuner.py`)
- **Purpose**: Automatically find optimal model parameters
- **Key Features**:
  - Bayesian optimization with Optuna
  - Multi-metric evaluation (Accuracy, F1-score)
  - Cross-validation strategy
  - Visualization of optimization process

### 4. Model Training (`model_trainer.py`)
- **Purpose**: Train stacked ensemble model
- **Key Features**:
  - Three base models (XGBoost, LightGBM, MLP)
  - Neural network meta-model
  - Class balancing and feature scaling
  - Comprehensive model evaluation

---

## 📈 Model Performance

### Training Pipeline
```python
# Complete training process
trainer = StackedEnsembleTrainer(
    model_data=processed_data,
    save_folder=Path("models"),
    optimized_params=optimization_results
)

results = trainer.train_pipeline()
```

### Expected Performance
- **Test Accuracy**: >85%
- **F1-Score (Macro)**: >0.80
- **Class-wise Precision**: 
  - CONFIRMED: >90%
  - CANDIDATE: >80% 
  - FALSE POSITIVE: >85%

---

## 🔧 Configuration

### Key Parameters
```python
RANDOM_STATE = 42  # For reproducibility
TRAIN_SIZE = 0.7   # Training set proportion
TEST_SIZE = 0.15   # Test set proportion  
CV_SIZE = 0.15     # Cross-validation set proportion

# Hyperparameter tuning
XGB_TRIALS = 100   # Number of XGBoost optimization trials
LGB_TRIALS = 100   # Number of LightGBM optimization trials
```

### Data Splitting Strategy
- **Training**: 70% - Model training
- **Testing**: 15% - Final evaluation
- **Cross-Validation**: 15% - Hyperparameter tuning

---

## 📁 Project Structure

```
ml-core/
│
├── src/
│   ├── data/
│   │   ├── data_loader_and_merger.py    # Data loading & merging
│   │   ├── data_preprocessor.py         # Data cleaning & feature engineering
│   │   └── data_visualizer.py           # EDA & visualization
│   │
│   ├── models/
│   │   ├── hyperparameter_tuner.py      # Model optimization
│   │   └── model_trainer.py             # Ensemble training
│   │
│   ├── utils/
│   │   ├── common.py                    # Logging utilities
│   │   └── entity.py                    # Data classes & enums
│   │
│   └── main.py                          # Pipeline orchestrator
│
├── data/
│   ├── raw/                            # Original NASA datasets
│   └── processed/                      # Processed data files
│
├── models/                             # Trained model artifacts
├── reports/
│   ├── figures/                        # Generated visualizations
│   └── logs/                           # Pipeline execution logs
│
└── requirements.txt                    # Python dependencies
```

---

## 📊 Output & Artifacts

### Generated Files
```
models/
├── feature_scaler.pkl          # Feature normalization
├── xgboost_model.pkl           # Trained XGBoost
├── lightgbm_model.pkl          # Trained LightGBM  
├── mlp_model.keras             # Trained neural network
├── meta_model.keras            # Ensemble meta-model
└── ensemble_info.pkl           # Model metadata

reports/figures/
├── histograms/                 # Feature distributions
├── correlation_heatmap.png     # Feature correlations
└── optimization_plots/         # Hyperparameter tuning results
```

### Logging
Comprehensive logging available in `reports/logs/`:
- Data preprocessing steps
- Model training progress
- Hyperparameter optimization results
- Final evaluation metrics

---

## 🔬 Advanced Features

### Feature Engineering
- **Physical Relationships**: Derived features based on astrophysical principles
- **Logarithmic Transformations**: Handle skewed distributions
- **Interaction Terms**: Capture complex feature relationships
- **Normalization**: Robust scaling for neural networks

### Model Optimization
- **Automated Tuning**: Bayesian optimization for hyperparameters
- **Class Balancing**: Handling imbalanced datasets
- **Early Stopping**: Prevent overfitting
- **Cross-Validation**: Robust performance estimation

---

## 🐛 Troubleshooting

### Common Issues
1. **Missing Data Files**
   - Ensure Kepler, K2, and TESS CSVs are in `data/` directory
   - Verify file permissions and paths

2. **Memory Issues**
   - Reduce dataset size for testing
   - Adjust batch sizes in neural networks

3. **Dependency Conflicts**
   - Use virtual environment
   - Check Python version compatibility

### Debug Mode
```python
# Enable detailed logging
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## 🤝 Contributing to ML Core

We welcome contributions! Areas of interest:
- New feature engineering ideas
- Additional model architectures
- Performance optimizations
- Data visualization improvements

---

**NASA Space Apps Challenge 2025** - Making exoplanet discovery accessible through AI!