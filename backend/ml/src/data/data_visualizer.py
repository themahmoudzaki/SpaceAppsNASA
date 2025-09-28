import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import logging
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from pathlib import Path
from ..utils.common import setup_logger

# import os
# from dotenv import load_dotenv
# load_dotenv()
# os.getenv("LOGGING_DIR", "reports/")

LOGGING_DIR = Path("../reports/") / "logs"
LOGGER_FILE_PATH = LOGGING_DIR / "Data_visualizer.log"
logger = setup_logger("DataVisualizer", LOGGER_FILE_PATH)

FIGS_PATH = Path("../reports") / "figures"
FIGS_PATH.mkdir(parents=True, exist_ok=True)



class EXODataVisualizer:
    def __init__(self, dataframe: pd.DataFrame):
        self.df = dataframe
        sns.set_theme(style="whitegrid")

    def visualize_data(self) -> None:
        logging.info(f"DataFrame shape: {self.df.shape}")
        logging.info(f"DataFrame dtypes:\n{self.df.dtypes}")
        logging.info(f"DataFrame head:\n{self.df.head()}")
        logging.info(f"DataFrame info: \n{self.df.info()}")
        logging.info(f"DataFrame describe:\n{self.df.describe()}")
        logging.info(f"DataFrame unique values:\n{self.df.nunique()}")

        self.df.hist(figsize=(15, 10), bins=30)
        plt.savefig(f'{FIGS_PATH / "hist"}')

        plt.figure(figsize=(12, 8))
        sns.heatmap(
            self.df.select_dtypes(include=["int", "float"]).corr(),
            annot=False,
            cmap="coolwarm",
        )
        plt.savefig(f'{FIGS_PATH / "heatmap"}')


__all__ = ["EXODataVisualizer"]
