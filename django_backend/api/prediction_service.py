import pandas as pd
import numpy as np
from pathlib import Path
from typing import Union, Dict, List, Optional, Tuple
import joblib
import warnings

import tensorflow as tf
from tensorflow import keras
import xgboost as xgb
import lightgbm as lgb

warnings.filterwarnings("ignore")


class ModelLoader:
    def __init__(self, model_dir: Union[str, Path]):
        """
        Initialize the model loader.

        Args:
            model_dir: Directory containing saved model files
        """
        self.model_dir = Path(model_dir)
        self._validate_model_files()

        self.feature_scaler = None
        self.xgb_model = None
        self.lgb_model = None
        self.mlp_model = None
        self.meta_model = None
        self.ensemble_info = None

    def _validate_model_files(self):
        required_files = [
            "feature_scaler.pkl",
            "xgboost_model.pkl",
            "lightgbm_model.pkl",
            "mlp_model.keras",
            "meta_model.keras",
            "ensemble_info.pkl",
        ]

        missing_files = []
        for file in required_files:
            if not (self.model_dir / file).exists():
                missing_files.append(file)

        if missing_files:
            raise FileNotFoundError(f"Missing model files: {missing_files}")

    def load_models(self) -> Dict:
        """
        Load all model components.

        Returns:
            Dictionary containing all loaded models
        """

        try:
            self.feature_scaler = joblib.load(self.model_dir / "feature_scaler.pkl")

            self.xgb_model = joblib.load(self.model_dir / "xgboost_model.pkl")

            self.lgb_model = joblib.load(self.model_dir / "lightgbm_model.pkl")

            self.mlp_model = keras.models.load_model(self.model_dir / "mlp_model.keras")

            self.meta_model = keras.models.load_model(
                self.model_dir / "meta_model.keras"
            )

            self.ensemble_info = joblib.load(self.model_dir / "ensemble_info.pkl")

            return {
                "feature_scaler": self.feature_scaler,
                "xgb_model": self.xgb_model,
                "lgb_model": self.lgb_model,
                "mlp_model": self.mlp_model,
                "meta_model": self.meta_model,
                "ensemble_info": self.ensemble_info,
            }

        except Exception as e:
            
            raise e("Error: {e}")
        


class PredictionService:
    def __init__(self, model_dir: Union[str, Path]):
        """
        Initialize the prediction service.

        Args:
            model_dir: Directory containing saved model files
        """
        self.model_loader = ModelLoader(model_dir)
        self.models = self.model_loader.load_models()

        self.feature_scaler = self.models["feature_scaler"]
        self.xgb_model = self.models["xgb_model"]
        self.lgb_model = self.models["lgb_model"]
        self.mlp_model = self.models["mlp_model"]
        self.meta_model = self.models["meta_model"]
        self.ensemble_info = self.models["ensemble_info"]

        self.class_names = self.ensemble_info.get(
            "class_names", ["FALSE_POSITIVE", "CANDIDATE", "CONFIRMED"]
        )

    def _validate_features(self, df: pd.DataFrame):
        """
        Validate that the DataFrame has the expected number of features.

        Args:
            df: Input DataFrame
        """
        expected_features = self.ensemble_info.get("n_features")
        if expected_features and df.shape[1] != expected_features:
            raise ValueError(
                f"Expected {expected_features} features, but got {df.shape[1]}"
            )

    def _preprocess_data(self, X: np.ndarray) -> np.ndarray:
        """
        Scale features using the fitted scaler.

        Args:
            X: Raw feature array

        Returns:
            Scaled feature array
        """
        return self.feature_scaler.transform(X)

    def _generate_meta_features(self, X_scaled: np.ndarray) -> np.ndarray:
        """
        Generate meta-features from base models.

        Args:
            X_scaled: Scaled feature array

        Returns:
            Meta-features array
        """
        xgb_proba = self.xgb_model.predict_proba(X_scaled)
        lgb_proba = self.lgb_model.predict_proba(X_scaled)
        mlp_proba = self.mlp_model.predict(X_scaled, verbose=0)

        meta_features = np.hstack([xgb_proba, lgb_proba, mlp_proba])

        return meta_features

    def predict_from_dataframe(
        self,
        df: pd.DataFrame,
        return_proba: bool = False,
        return_meta_features: bool = False,
    ) -> Dict:
        """
        Make predictions from a pandas DataFrame.

        Args:
            df: Input DataFrame with features
            return_proba: Whether to return class probabilities
            return_meta_features: Whether to return intermediate meta-features

        Returns:
            Dictionary containing predictions and optionally probabilities
        """

        self._validate_features(df)

        X = df.values

        X_scaled = self._preprocess_data(X)

        meta_features = self._generate_meta_features(X_scaled)

        meta_proba = self.meta_model.predict(meta_features, verbose=0)
        predictions = np.argmax(meta_proba, axis=1)

        predicted_classes = [self.class_names[pred] for pred in predictions]

        results = {
            "predictions": predicted_classes,
            "prediction_indices": predictions.tolist(),
        }

        if return_proba:
            proba_df = pd.DataFrame(meta_proba, columns=self.class_names)
            results["probabilities"] = proba_df

            results["confidence"] = meta_proba.max(axis=1).tolist()

        if return_meta_features:
            meta_columns = []
            for model in ["xgb", "lgb", "mlp"]:
                for cls in self.class_names:
                    meta_columns.append(f"{model}_{cls}")

            meta_df = pd.DataFrame(meta_features, columns=meta_columns)
            results["meta_features"] = meta_df


        return results

    def predict_from_csv(
        self,
        csv_path: Union[str, Path],
        return_proba: bool = False,
        return_meta_features: bool = False,
        **csv_kwargs,
    ) -> Dict:
        """
        Make predictions from a CSV file.

        Args:
            csv_path: Path to the CSV file
            return_proba: Whether to return class probabilities
            return_meta_features: Whether to return intermediate meta-features
            **csv_kwargs: Additional arguments to pass to pd.read_csv

        Returns:
            Dictionary containing predictions and optionally probabilities
        """
        csv_path = Path(csv_path)

        if not csv_path.exists():
            raise FileNotFoundError(f"CSV file not found: {csv_path}")


        df = pd.read_csv(csv_path, **csv_kwargs)

        return self.predict_from_dataframe(df, return_proba, return_meta_features)

    def predict_single(self, features: Union[List, np.ndarray]) -> Dict:
        """
        Make prediction for a single sample.

        Args:
            features: Feature values for a single sample

        Returns:
            Dictionary with prediction details
        """
        if isinstance(features, list):
            features = np.array(features)

        if features.ndim == 1:
            features = features.reshape(1, -1)

        df = pd.DataFrame(features)

        results = self.predict_from_dataframe(df, return_proba=True)

        return {
            "prediction": results["predictions"][0],
            "confidence": results["confidence"][0],
            "probabilities": {
                cls: float(prob)
                for cls, prob in results["probabilities"].iloc[0].items()
            },
        }

    def batch_predict_with_results(
        self, df: pd.DataFrame, include_input: bool = True
    ) -> pd.DataFrame:
        """
        Make predictions and return results combined with input data.

        Args:
            df: Input DataFrame with features
            include_input: Whether to include input features in results

        Returns:
            DataFrame with predictions added
        """
        results = self.predict_from_dataframe(df, return_proba=True)

        if include_input:
            output_df = df.copy()
        else:
            output_df = pd.DataFrame()

        output_df["prediction"] = results["predictions"]
        output_df["confidence"] = results["confidence"]

        for cls in self.class_names:
            output_df[f"prob_{cls}"] = results["probabilities"][cls]

        return output_df

    def save_predictions(
        self, predictions: Dict, output_path: Union[str, Path], format: str = "csv"
    ):
        """
        Save predictions to file.

        Args:
            predictions: Predictions dictionary from predict methods
            output_path: Path to save the file
            format: Output format ('csv' or 'excel')
        """
        output_path = Path(output_path)

        output_df = pd.DataFrame({"prediction": predictions["predictions"]})

        if "confidence" in predictions:
            output_df["confidence"] = predictions["confidence"]

        if "probabilities" in predictions:
            prob_df = predictions["probabilities"]
            for col in prob_df.columns:
                output_df[f"prob_{col}"] = prob_df[col]

        if format.lower() == "csv":
            output_df.to_csv(output_path, index=False)
        elif format.lower() in ["excel", "xlsx"]:
            output_df.to_excel(output_path, index=False)
        else:
            raise ValueError(f"Unsupported format: {format}")


# Example usage
'''
model_dir = Path("path/to/saved/models")
service = PredictionService(model_dir)

# Example 1: Predict from CSV
results = service.predict_from_csv("data.csv", return_proba=True)
print(f"Predictions: {results['predictions'][:5]}")
print(f"Confidence scores: {results['confidence'][:5]}")

# Example 2: Predict from DataFrame
df = pd.read_csv("data.csv")
results = service.predict_from_dataframe(df, return_proba=True)

# Example 3: Get predictions with input data
combined_results = service.batch_predict_with_results(df)
print(combined_results.head())

# Example 4: Save predictions
service.save_predictions(results, "predictions.csv")

# Example 5: Single prediction
single_result = service.predict_single([1.0, 2.0, 3.0, ...])  # Add your features
print(f"Single prediction: {single_result}")
'''