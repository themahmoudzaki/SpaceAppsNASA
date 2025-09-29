from dataclasses import dataclass
from enum import IntEnum
import pandas as pd


class Disposition(IntEnum):
    FALSE_POSITIVE = 0
    CANDIDATE = 1
    CONFIRMED = 2


@dataclass
class ModelData:
    X_train: pd.DataFrame
    y_train: pd.Series
    X_test: pd.DataFrame
    y_test: pd.Series
    X_cv: pd.DataFrame
    y_cv: pd.Series


__all__ = ["Disposition", "ModelData"]
