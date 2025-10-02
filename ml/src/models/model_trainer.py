import pandas as pd
import numpy as np
from pathlib import Path
from typing import Tuple
import logging

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

import xgboost as xgb
import lightgbm as lgb
import joblib

from ..utils.entity import ModelData, Disposition
from ..utils.common import setup_logger

RANDOM_STATE = 42
LOGGER_FILE_PATH = Path("reports") / "logs" / "Model_trainer.log"
logger = setup_logger("ModelTrainer", LOGGER_FILE_PATH)


class StackedEnsembleTrainer:
    def __init__(self, model_data: ModelData, save_folder: Path):
        self.model_data = model_data
        self.save_folder = save_folder
        self.save_folder.mkdir(parents=True, exist_ok=True)

        self.feature_scaler = StandardScaler()
        self.xgb_model = None
        self.lgb_model = None
        self.mlp_model = None
        self.meta_model = None

        self.X_train_scaled = None
        self.X_test_scaled = None
        self.X_cv_scaled = None

    def preprocess_features(self):
        logger.info("Scaling features")

        self.X_train_scaled = self.feature_scaler.fit_transform(self.model_data.X_train)
        self.X_test_scaled = self.feature_scaler.transform(self.model_data.X_test)
        self.X_cv_scaled = self.feature_scaler.transform(self.model_data.X_cv)

        joblib.dump(self.feature_scaler, self.save_folder / "feature_scaler.pkl")
        logger.info("Feature scaling complete")

    def build_xgboost_model(self):
        logger.info("Training XGBoost model")
        self.xgb_model = xgb.XGBClassifier(
            n_estimators=1024,
            max_depth=8,
            learning_rate=0.01,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="multi:softmax",
            num_class=3,
            random_state=RANDOM_STATE,
            eval_metric="mlogloss",
            early_stopping_rounds=50,
        )

        self.xgb_model.fit(
            self.X_train_scaled,
            self.model_data.y_train,
            eval_set=[(self.X_cv_scaled, self.model_data.y_cv)],
            verbose=50,
        )

        train_pred = self.xgb_model.predict(self.X_train_scaled)
        cv_pred = self.xgb_model.predict(self.X_cv_scaled)

        logger.info(
            f"XGBoost Train Accuracy: {accuracy_score(self.model_data.y_train, train_pred):.4f}"
        )
        logger.info(
            f"XGBoost CV Accuracy: {accuracy_score(self.model_data.y_cv, cv_pred):.4f}"
        )

    def build_lightgbm_model(self):
        logger.info("Training LightGBM model")

        self.lgb_model = lgb.LGBMClassifier(
            n_estimators=1024,
            max_depth=8,
            learning_rate=0.01,
            num_leaves=31,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="multiclass",
            num_class=3,
            random_state=RANDOM_STATE,
            metric="multi_logloss",
            verbose=-1,
        )

        self.lgb_model.fit(
            self.X_train_scaled,
            self.model_data.y_train,
            eval_set=[(self.X_cv_scaled, self.model_data.y_cv)],
            callbacks=[lgb.early_stopping(50), lgb.log_evaluation(50)],
        )

        train_pred = self.lgb_model.predict(self.X_train_scaled)
        cv_pred = self.lgb_model.predict(self.X_cv_scaled)

        logger.info(
            f"LightGBM Train Accuracy: {accuracy_score(self.model_data.y_train, train_pred):.4f}"
        )
        logger.info(
            f"LightGBM CV Accuracy: {accuracy_score(self.model_data.y_cv, cv_pred):.4f}"
        )

    def build_mlp_model(self):
        logger.info("Training MLP model")

        n_features = self.X_train_scaled.shape[1]
        self.mlp_model = models.Sequential(
            [
                layers.Input(shape=(n_features,)),
                layers.Dense(256, activation="relu"),
                layers.BatchNormalization(),
                layers.Dropout(0.3),
                layers.Dense(128, activation="relu"),
                layers.BatchNormalization(),
                layers.Dropout(0.3),
                layers.Dense(64, activation="relu"),
                layers.BatchNormalization(),
                layers.Dropout(0.2),
                layers.Dense(32, activation="relu"),
                layers.Dropout(0.2),
                layers.Dense(3, activation="softmax"),
            ]
        )

        self.mlp_model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"],
        )

        early_stop = keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=20, restore_best_weights=True
        )

        reduce_lr = keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=10, min_lr=1e-7
        )

        self.mlp_model.fit(
            self.X_train_scaled,
            self.model_data.y_train,
            validation_data=(self.X_cv_scaled, self.model_data.y_cv),
            epochs=200,
            batch_size=64,
            callbacks=[early_stop, reduce_lr],
            verbose=1,
        )

        train_loss, train_acc = self.mlp_model.evaluate(
            self.X_train_scaled, self.model_data.y_train, verbose=0
        )
        cv_loss, cv_acc = self.mlp_model.evaluate(
            self.X_cv_scaled, self.model_data.y_cv, verbose=0
        )

        logger.info(f"MLP Train Accuracy: {train_acc:.4f}")
        logger.info(f"MLP CV Accuracy: {cv_acc:.4f}")

    def generate_meta_features(self) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        logging.info("Generate meta-features")

        xgb_train_proba = self.xgb_model.predict_proba(self.X_train_scaled)
        xgb_cv_proba = self.xgb_model.predict_proba(self.X_cv_scaled)
        xgb_test_proba = self.xgb_model.predict_proba(self.X_test_scaled)

        lgb_train_proba = self.lgb_model.predict_proba(self.X_train_scaled)
        lgb_cv_proba = self.lgb_model.predict_proba(self.X_cv_scaled)
        lgb_test_proba = self.lgb_model.predict_proba(self.X_test_scaled)

        mlp_train_proba = self.mlp_model.predict(self.X_train_scaled)
        mlp_cv_proba = self.mlp_model.predict(self.X_cv_scaled)
        mlp_test_proba = self.mlp_model.predict(self.X_test_scaled)

        meta_train = np.hstack([xgb_train_proba, lgb_train_proba, mlp_train_proba])
        meta_cv = np.hstack([xgb_cv_proba, lgb_cv_proba, mlp_cv_proba])
        meta_test = np.hstack([xgb_test_proba, lgb_test_proba, mlp_test_proba])

        logger.info(f"Meta-features shape: {meta_train.shape}")

        return meta_train, meta_cv, meta_test

    def build_meta_model(self, meta_train: np.ndarray, meta_cv: np.ndarray):
        logger.info("Training meta-model")

        n_meta_features = meta_train.shape[1]

        self.meta_model = models.Sequential(
            [
                layers.Input(shape=(n_meta_features,)),
                layers.Dense(64, activation="relu"),
                layers.BatchNormalization(),
                layers.Dropout(0.3),
                layers.Dense(32, activation="relu"),
                layers.Dropout(0.2),
                layers.Dense(3, activation="softmax"),
            ]
        )

        self.meta_model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"],
        )

        early_stop = keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=30, restore_best_weights=True
        )

        self.meta_model.fit(
            meta_train,
            self.model_data.y_train,
            validation_data=(meta_cv, self.model_data.y_cv),
            epochs=200,
            batch_size=32,
            callbacks=[early_stop],
            verbose=1,
        )

        train_loss, train_acc = self.meta_model.evaluate(
            meta_train, self.model_data.y_train, verbose=0
        )
        cv_loss, cv_acc = self.meta_model.evaluate(
            meta_cv, self.model_data.y_cv, verbose=0
        )

        logger.info(f"Meta-Model Train Accuracy: {train_acc:.4f}")
        logger.info(f"Meta-Model CV Accuracy: {cv_acc:.4f}")

    def evaluate_ensemble(self, meta_test: np.ndarray):
        logger.info("Evaluating stacked ensemble")

        test_pred = np.argmax(self.meta_model.predict(meta_test), axis=1)

        test_acc = accuracy_score(self.model_data.y_test, test_pred)
        logger.info(f"\nStacked Ensemble Test Accuracy: {test_acc:.4f}")

        report = classification_report(
            self.model_data.y_test,
            test_pred,
            target_names=["FALSE_POSITIVE", "CANDIDATE", "CONFIRMED"],
        )
        logger.info(f"\nClassification Report:\n{report}")

        cm = confusion_matrix(self.model_data.y_test, test_pred)
        logger.info(f"\nConfusion Matrix:\n{cm}")

        return test_acc, report, cm

    def save_models(self):
        logger.info("Saving stacked ensemble models")

        model_dir = self.save_folder
        model_dir.mkdir(parents=True, exist_ok=True)

        joblib.dump(self.feature_scaler, model_dir / "feature_scaler.pkl")
        logger.info("Saved feature scaler")

        joblib.dump(self.xgb_model, model_dir / "xgboost_model.pkl")
        logger.info("Saved XGBoost model")

        joblib.dump(self.lgb_model, model_dir / "lightgbm_model.pkl")
        logger.info("Saved LightGBM model")

        self.mlp_model.save(model_dir / "mlp_model.keras")
        logger.info("Saved MLP model")

        self.meta_model.save(model_dir / "meta_model.keras")
        logger.info("Saved meta-model")

        ensemble_info = {
            "version": "1.0",
            "n_features": self.X_train_scaled.shape[1],
            "class_names": ["FALSE_POSITIVE", "CANDIDATE", "CONFIRMED"],
            "training_date": pd.Timestamp.now().isoformat(),
        }
        joblib.dump(ensemble_info, model_dir / "ensemble_info.pkl")
        logger.info("Saved ensemble metadata")

        logger.info(f"All models saved successfully to: {model_dir}")
        logger.info("\nSaved files:")
        for file in sorted(model_dir.glob("*")):
            size_mb = file.stat().st_size / (1024 * 1024)
            logger.info(f"  - {file.name} ({size_mb:.2f} MB)")

    def train_pipeline(self):
        """Execute complete training pipeline."""
        logger.info("Starting stacked ensemble training pipeline...")

        self.preprocess_features()

        self.build_xgboost_model()
        self.build_lightgbm_model()
        self.build_mlp_model()

        meta_train, meta_cv, meta_test = self.generate_meta_features()

        self.build_meta_model(meta_train, meta_cv)

        test_acc, report, cm = self.evaluate_ensemble(meta_test)

        self.save_models()

        logger.info("Training pipeline complete!")

        return {
            "test_accuracy": test_acc,
            "classification_report": report,
            "confusion_matrix": cm,
        }


__all__ = ["StackedEnsembleTrainer"]
