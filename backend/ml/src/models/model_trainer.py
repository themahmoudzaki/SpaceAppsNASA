from sklearn.model_selection import train_test_split
import pandas as pd
from dataclasses import dataclass
from ..utils.entity import ModelData


class ModelTrainer:
    def __init__(self, dataframe: ModelData):
        self.df = dataframe

        self.training_data = self.df.training_data
        self.testing_data = self.df.testing_data
        self.cross_validation_data = self.df.cross_validation_data

    def train_XG(self):
        pass

    def train_LGM(self):
        pass

    def train_MLP(self):
        pass


__all__ = ["ModelData", "ModelTrainer"]
