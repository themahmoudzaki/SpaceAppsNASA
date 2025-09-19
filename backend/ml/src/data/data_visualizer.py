import matplotlib.pyplot as plt
import seaborn as sns


class EXODataVisualizer:
    def __init__(self, dataframe):
        self.df = dataframe
        sns.set_theme(style="whitegrid")


__all__ = ["EXODataVisualizer"]
