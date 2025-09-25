import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import logging
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from pathlib import Path

# import os
# from dotenv import load_dotenv
# load_dotenv()
# os.getenv("LOGGING_DIR", "reports/")

LOGGING_DIR = Path("../reports")
LOGGING_DIR.mkdir(parents=True, exist_ok=True)

logging_file = LOGGING_DIR / "Data_visualizer.log"
file_handler = logging.FileHandler(str(logging_file))
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(), file_handler],
    force=True,  # Have to add since logger is already called before in dlm.py and caused some issues might look into a global logger later
)


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
        plt.savefig(f'{LOGGING_DIR / "hist"}')

        plt.figure(figsize=(12, 8))
        sns.heatmap(
            self.df.select_dtypes(include=["int", "float"]).corr(),
            annot=False,
            cmap="coolwarm",
        )
        plt.savefig(f'{LOGGING_DIR / "heatmap"}')


__all__ = ["EXODataVisualizer"]
