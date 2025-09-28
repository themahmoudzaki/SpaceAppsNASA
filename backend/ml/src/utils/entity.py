from dataclasses import dataclass
from enum import IntEnum
import pandas as pd


class Disposition(IntEnum):
    FALSE_POSITIVE = 0
    CANDIDATE = 1
    CONFIRMED = 2


@dataclass
class ModelData:
    training_data: pd.DataFrame
    testing_data: pd.DataFrame
    cross_validation_data: pd.DataFrame


__all__ = ["Disposition", "ModelData"]
