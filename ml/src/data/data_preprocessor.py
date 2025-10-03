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

        missing_ratio = dataframe.isnull().sum() / len(dataframe)
        columns_to_keep = missing_ratio[missing_ratio < 0.8].index
        dataframe = dataframe[columns_to_keep]

        logger.info(f"After removing high-missing columns: {dataframe.shape}")

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

    def sanitize_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        logger.info("Sanitizing dataframe - removing infinite values")

        df = df.replace([np.inf, -np.inf], np.nan)

        critical_columns = ["period", "duration", "star_radius", "semi_major_axis"]
        for col in critical_columns:
            if col in df.columns:
                df[col] = df[col].replace(0, 1e-10)
                df.loc[df[col] < 0, col] = np.nan

        return df

    def add_derived_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = self.sanitize_dataframe(df)

        try:
            epsilon = 1e-10

            df["transit_signal_strength"] = (
                df["depth"] * df["duration"] / (df["period"] + epsilon)
            )
            df["radius_ratio"] = df["planet_radius"] / (df["star_radius"] + epsilon)
            df["transit_probability"] = df["star_radius"] / (
                df["semi_major_axis"] + epsilon
            )
            df["orbital_velocity"] = (2 * np.pi * df["semi_major_axis"]) / (
                df["period"] + epsilon
            )
            df["stellar_flux"] = df["teff"] ** 4 / (
                (df["semi_major_axis"] + epsilon) ** 2
            )
            df["transit_depth_norm"] = df["depth"] / (
                (df["star_radius"] + epsilon) ** 2
            )
            df["habitable_zone_proxy"] = np.sqrt(df["teff"] / 5778) / np.sqrt(
                df["semi_major_axis"] + epsilon
            )

            df["radius_temp_interaction"] = df["planet_radius"] * df["teff"]
            df["period_depth_interaction"] = df["period"] * np.log1p(df["depth"])

            for col in ["period", "duration", "depth", "planet_radius", "star_radius"]:
                if col in df.columns:
                    clipped = np.clip(df[col], 1e-10, 1e10)
                    df[f"log_{col}"] = np.log1p(clipped)
                    df[f"log_{col}_squared"] = np.log1p(clipped) ** 2

        except Exception as e:
            logger.error(f"Error in feature engineering: {e}")
            raise

        df = self.sanitize_dataframe(df)
        return df

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
        dataframe = self.df.copy()
        dataframe["disposition"] = dataframe["disposition"].str.strip()
        valid_labels = ["CONFIRMED", "CANDIDATE", "FALSE POSITIVE"]

        initial_rows = len(dataframe)
        clean_df = dataframe[dataframe["disposition"].isin(valid_labels)].copy()
        rows_removed = initial_rows - len(clean_df)
        if rows_removed > 0:
            logger.warning(
                f"Removed {rows_removed} rows with invalid 'disposition' labels."
            )

        clean_df = self.sanitize_dataframe(clean_df)
        clean_df = self.handle_missing_values(clean_df)
        clean_df = self.add_derived_features(clean_df)
        clean_df = self.sanitize_dataframe(clean_df)

        y_unencoded = clean_df["disposition"]
        y_encoded = self._encode_target_variable(y_unencoded)

        X = clean_df.drop(columns=["disposition", "source"])

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
