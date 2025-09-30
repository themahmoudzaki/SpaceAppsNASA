import pandas as pd
import numpy as np
from enum import IntEnum
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer, KNNImputer
from typing import Optional
from pathlib import Path

from dataclasses import dataclass
from ..utils.entity import Disposition, ModelData
from ..utils.common import setup_logger

RANDOM_STATE = 42

LOGGER_FILE_PATH = Path("reports") / "logs" / "Data_preprocessor.log"
logger = setup_logger("DataPreprocessor", LOGGER_FILE_PATH)


class DataPreprocessor:
    def __init__(
        self,
        dataframe: pd.DataFrame,
        data_folder: Optional[Path] = None,
        imputation_strategy: str = "knn",
    ):
        self.df = dataframe.copy()
        self.data_folder = data_folder
        self.imputation_strategy = imputation_strategy
        self.numeric_imputer = None
        self.categorical_imputer = None

    def handle_missing_values(self, dataframe: pd.DataFrame) -> pd.DataFrame:
        logger.info(f"Initial shape: {dataframe.shape}")
        logger.info(f"Missing values per column:\n{dataframe.isnull().sum()}")

        numeric_cols = dataframe.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = dataframe.select_dtypes(exclude=[np.number]).columns.tolist()
        if "disposition" in numeric_cols:
            numeric_cols.remove("disposition")
        if "disposition" in categorical_cols:
            categorical_cols.remove("disposition")

        dataframe = dataframe.dropna(subset=["disposition"])
        logger.info(f"After removing rows with missing target: {dataframe.shape}")

        if numeric_cols:
            if self.imputation_strategy == "knn":
                self.numeric_imputer = KNNImputer(n_neighbors=5, weights="distance")
            else:
                self.numeric_imputer = SimpleImputer(strategy="median")

            numeric_data_to_impute = dataframe[numeric_cols]
            dataframe[numeric_cols] = pd.DataFrame(
                self.numeric_imputer.fit_transform(numeric_data_to_impute),
                index=numeric_data_to_impute.index,
                columns=numeric_data_to_impute.columns,
            )
            logger.info(
                f"Applied {self.imputation_strategy} imputation for numeric columns"
            )

        if categorical_cols:
            self.categorical_imputer = SimpleImputer(strategy="most_frequent")

            categorical_data_to_impute = dataframe[categorical_cols]
            dataframe[categorical_cols] = pd.DataFrame(
                self.categorical_imputer.fit_transform(categorical_data_to_impute),
                index=categorical_data_to_impute.index,
                columns=categorical_data_to_impute.columns,
            )
            logger.info("Applied mode imputation for categorical columns")

        logger.info(f"Final shape after imputation: {dataframe.shape}")
        logger.info(f"Remaining missing values: {dataframe.isnull().sum().sum()}")

        return dataframe

    def _encode_target_variable(self, y: pd.Series) -> pd.Series:
        mapping = {
            "CONFIRMED": Disposition.CONFIRMED,
            "CANDIDATE": Disposition.CANDIDATE,
            "FALSE POSITIVE": Disposition.FALSE_POSITIVE,
        }
        return y.map(mapping)

    def split_data(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        train_size: float = 0.7,
        test_size: float = 0.15,
        cv_size: float = 0.15,
    ) -> list[pd.DataFrame]:
        assert (
            abs(train_size + test_size + cv_size - 1.0) < 1e-6
        ), "Train, test, and CV sizes must sum to 1.0"

        X_train, X_test_cv, y_train, y_test_cv = train_test_split(
            X,
            y,
            test_size=(test_size + cv_size),
            shuffle=True,
            random_state=RANDOM_STATE,
            stratify=y,
        )

        relative_test_size = test_size / (test_size + cv_size)
        X_test, X_cv, y_test, y_cv = train_test_split(
            X_test_cv,
            y_test_cv,
            test_size=(1 - relative_test_size),
            shuffle=True,
            random_state=RANDOM_STATE,
            stratify=y_test_cv,
        )

        logger.info(
            f"Data split - Train: {X_train.shape}, Test: {X_test.shape}, CV: {X_cv.shape}"
        )
        logger.info(
            f"Class distribution - Train: {pd.Series(y_train).value_counts().to_dict()}"
        )
        logger.info(
            f"Class distribution - Test: {pd.Series(y_test).value_counts().to_dict()}"
        )
        logger.info(
            f"Class distribution - CV: {pd.Series(y_cv).value_counts().to_dict()}"
        )

        return [X_train, y_train, X_test, y_test, X_cv, y_cv]

    def save_data(self, data: ModelData, data_folder: Optional[Path] = None) -> None:
        data_folder = data_folder if data_folder is not None else self.data_folder

        if data_folder is None:
            logger.warning(f"No output directory provided. Skipping data saving")

            return

        data_folder.mkdir(parents=True, exist_ok=True)

        data.X_train.to_csv(data_folder / "X_train.csv", index=False)
        data.y_train.to_csv(data_folder / "y_train.csv", index=False)
        data.X_test.to_csv(data_folder / "X_test.csv", index=False)
        data.y_test.to_csv(data_folder / "y_test.csv", index=False)
        data.X_cv.to_csv(data_folder / "X_cv.csv", index=False)
        data.y_cv.to_csv(data_folder / "y_cv.csv", index=False)

        logger.info(f"Saved processed data to {data_folder}")

    def processing_pipeline(self) -> ModelData:
        clean_df = self.handle_missing_values(self.df)

        y_unencoded = clean_df["disposition"]
        y_encoded = self._encode_target_variable(y_unencoded)

        X = clean_df.drop(columns=["disposition"])

        X_train, y_train_unencoded, X_test, y_test_unencoded, X_cv, y_cv_unencoded = (
            self.split_data(X, y_unencoded)
        )

        y_train = self._encode_target_variable(y_train_unencoded)
        y_test = self._encode_target_variable(y_test_unencoded)
        y_cv = self._encode_target_variable(y_cv_unencoded)

        model_data = ModelData(
            X_train=X_train,
            y_train=y_train,
            X_test=X_test,
            y_test=y_test,
            X_cv=X_cv,
            y_cv=y_cv,
        )
        if self.data_folder:
            self.save_data(model_data)
        logger.info("Preprocessing pipeline complete!")

        return model_data


__all__ = ["DataPreprocessor"]
