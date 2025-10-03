import pandas as pd
import numpy as np
from pathlib import Path
import logging

import optuna
from optuna.visualization import (
    plot_optimization_history,
    plot_param_importances,
    plot_slice,
)
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import accuracy_score, f1_score
import joblib

from ..utils.entity import ModelData
from ..utils.common import setup_logger

RANDOM_STATE = 42
LOGGER_FILE_PATH = Path("reports") / "logs" / "Hyperparameter_tuner.log"
logger = setup_logger("HyperparameterTuner", LOGGER_FILE_PATH)


class HyperparameterTuner:

    def __init__(self, model_data: ModelData, save_folder: Path):
        self.model_data = model_data
        self.save_folder = save_folder
        self.save_folder.mkdir(parents=True, exist_ok=True)

        self.best_xgb_params = None
        self.best_lgb_params = None
        self.best_mlp_params = None

    def optimize_xgboost(self, n_trials: int = 100, metric: str = "f1_macro"):
        logger.info(f"Starting XGBoost optimization with {n_trials} trials")

        def objective(trial):
            params = {
                "n_estimators": trial.suggest_int("n_estimators", 500, 2000),
                "max_depth": trial.suggest_int("max_depth", 4, 12),
                "learning_rate": trial.suggest_float(
                    "learning_rate", 0.001, 0.1, log=True
                ),
                "subsample": trial.suggest_float("subsample", 0.6, 1.0),
                "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
                "min_child_weight": trial.suggest_int("min_child_weight", 1, 10),
                "gamma": trial.suggest_float("gamma", 0, 5),
                "reg_alpha": trial.suggest_float("reg_alpha", 0, 10),
                "reg_lambda": trial.suggest_float("reg_lambda", 0, 10),
                "objective": "multi:softmax",
                "num_class": 3,
                "random_state": RANDOM_STATE,
                "eval_metric": "mlogloss",
                "early_stopping_rounds": 50,
            }

            model = xgb.XGBClassifier(**params)
            model.fit(
                self.model_data.X_train,
                self.model_data.y_train,
                eval_set=[(self.model_data.X_cv, self.model_data.y_cv)],
                verbose=False,
            )

            preds = model.predict(self.model_data.X_cv)

            if metric == "accuracy":
                return accuracy_score(self.model_data.y_cv, preds)
            elif metric == "f1_macro":
                return f1_score(self.model_data.y_cv, preds, average="macro")
            elif metric == "f1_weighted":
                return f1_score(self.model_data.y_cv, preds, average="weighted")

        study = optuna.create_study(
            direction="maximize",
            study_name="xgboost_optimization",
            sampler=optuna.samplers.TPESampler(seed=RANDOM_STATE),
        )

        study.optimize(objective, n_trials=n_trials, show_progress_bar=True)

        self.best_xgb_params = study.best_params
        logger.info(f"Best XGBoost {metric}: {study.best_value:.4f}")
        logger.info(f"Best XGBoost params: {study.best_params}")

        self._save_study_results(study, "xgboost")

        return study.best_params, study

    def optimize_lightgbm(self, n_trials: int = 100, metric: str = "f1_macro"):
        logger.info(f"Starting LightGBM optimization with {n_trials} trials")

        def objective(trial):
            params = {
                "n_estimators": trial.suggest_int("n_estimators", 500, 2000),
                "max_depth": trial.suggest_int("max_depth", 4, 12),
                "learning_rate": trial.suggest_float(
                    "learning_rate", 0.001, 0.1, log=True
                ),
                "num_leaves": trial.suggest_int("num_leaves", 20, 100),
                "subsample": trial.suggest_float("subsample", 0.6, 1.0),
                "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
                "min_child_weight": trial.suggest_float("min_child_weight", 1e-3, 10),
                "reg_alpha": trial.suggest_float("reg_alpha", 0, 10),
                "reg_lambda": trial.suggest_float("reg_lambda", 0, 10),
                "objective": "multiclass",
                "num_class": 3,
                "random_state": RANDOM_STATE,
                "metric": "multi_logloss",
                "verbose": -1,
            }

            model = lgb.LGBMClassifier(**params)
            model.fit(
                self.model_data.X_train,
                self.model_data.y_train,
                eval_set=[(self.model_data.X_cv, self.model_data.y_cv)],
                callbacks=[lgb.early_stopping(50)],
            )

            preds = model.predict(self.model_data.X_cv)

            if metric == "accuracy":
                return accuracy_score(self.model_data.y_cv, preds)
            elif metric == "f1_macro":
                return f1_score(self.model_data.y_cv, preds, average="macro")
            elif metric == "f1_weighted":
                return f1_score(self.model_data.y_cv, preds, average="weighted")

        study = optuna.create_study(
            direction="maximize",
            study_name="lightgbm_optimization",
            sampler=optuna.samplers.TPESampler(seed=RANDOM_STATE),
        )

        study.optimize(objective, n_trials=n_trials, show_progress_bar=True)

        self.best_lgb_params = study.best_params
        logger.info(f"Best LightGBM {metric}: {study.best_value:.4f}")
        logger.info(f"Best LightGBM params: {study.best_params}")

        self._save_study_results(study, "lightgbm")

        return study.best_params, study

    def _save_study_results(self, study: optuna.Study, model_name: str):
        """Save optimization results and visualizations"""

        # Save best params
        joblib.dump(
            study.best_params, self.save_folder / f"{model_name}_best_params.pkl"
        )

        # Save study object
        joblib.dump(study, self.save_folder / f"{model_name}_study.pkl")

        viz_folder = self.save_folder / "optuna_viz"
        viz_folder.mkdir(exist_ok=True)

    def optimize_all(self, xgb_trials: int = 100, lgb_trials: int = 100):
        logger.info("\nOptimizing XGBoost")
        xgb_params, xgb_study = self.optimize_xgboost(n_trials=xgb_trials)

        logger.info("\nOptimizing LightGBM")
        lgb_params, lgb_study = self.optimize_lightgbm(n_trials=lgb_trials)

        summary = {
            "xgboost": {
                "best_score": xgb_study.best_value,
                "best_params": xgb_params,
            },
            "lightgbm": {
                "best_score": lgb_study.best_value,
                "best_params": lgb_params,
            },
        }

        joblib.dump(summary, self.save_folder / "optimization_summary.pkl")
        logger.info(f"Saved optimization summary to {self.save_folder}")

        return summary


__all__ = ["HyperparameterTuner"]
