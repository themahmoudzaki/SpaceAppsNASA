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
