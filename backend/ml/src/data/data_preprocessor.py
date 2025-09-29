import pandas as pd
from dataclasses import dataclass
from enum import IntEnum
from ..utils.entity import Disposition, ModelData
from sklearn.model_selection import train_test_split
from typing import Optional
from pathlib import Path
from ..utils.common import setup_logger

RANDOM_STATE = 42

LOGGER_FILE_PATH = Path("reports") / "logs" / "Data_preprocessor.log"
logger = setup_logger("DataPreprocessor", LOGGER_FILE_PATH)


class DataPreprocessor:
    def __init__(self, dataframe: pd.DataFrame, data_folder: Optional[Path] = None):
        self.df = dataframe
        self.data_folder = data_folder

    def handle_missing_values(self, dataframe: pd.DataFrame) -> pd.DataFrame:
        # Temporary solution
        return dataframe.dropna()

    def _encode_target_variable(self, y: pd.Series) -> pd.Series:
        mapping = {
            "CONFIRMED": Disposition.CONFIRMED,
            "CANDIDATE": Disposition.CANDIDATE,
            "FALSE POSITIVE": Disposition.FALSE_POSITIVE,
        }
        return y.map(mapping)

    def split_data(self, X: pd.DataFrame, y: pd.Series) -> list[pd.DataFrame]:
        X_train, X_test_cv, y_train, y_test_cv = train_test_split(
            X,
            y,
            test_size=0.3,
            train_size=0.7,
            shuffle=True,
            random_state=RANDOM_STATE,
            stratify=y,
        )

        X_test, X_cv, y_test, y_cv = train_test_split(
            X_test_cv,
            y_test_cv,
            test_size=0.5,
            train_size=0.5,
            shuffle=True,
            random_state=RANDOM_STATE,
            stratify=y_test_cv,
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

        return model_data
