import pandas as pd
from dataclasses import dataclass
from enum import IntEnum
from ..utils.entity import Disposition, ModelData


class DataPreprocessor:
    def __init__(self, dataframe: pd.DataFrame):
        self.df = dataframe

    def _handle_missing_values(self) -> None: pass
    def _split_data(self) -> None: pass
    def _encode_target_variable(self) -> pd.Series: pass
    def processing_pipeline(self) -> ModelData: pass
