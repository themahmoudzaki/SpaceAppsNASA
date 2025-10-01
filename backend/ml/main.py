import os
from dotenv import load_dotenv
from pathlib import Path

from src.data.data_loader_and_merger import ExoPlanetData
from src.data.data_visualizer import EXODataVisualizer
from src.data.data_preprocessor import DataPreprocessor
from src.utils.common import setup_logger

load_dotenv()

LOGGER_FILE_PATH = Path("reports") / "logs" / "Data_loader_merger.log"
logger = setup_logger("Main", LOGGER_FILE_PATH)


def main():
    logger.info("=" * 80)
    logger.info("EXOPLANET CLASSIFICATION PIPELINE - NASA SPACE APPS COMPETITION")
    logger.info("=" * 80)

    data_folder = Path("data")
    processed_data_folder = data_folder / "processed"
    k2_path = data_folder / "K2_mission_captured_data.csv"
    kepler_path = data_folder / "Kepler_captured_data.csv"
    tess_path = data_folder / "TESS_mission_captured_data.csv"

    logger.info("\n[STEP 1/5] Loading and merging datasets...")
    data_loader = ExoPlanetData(
        kepler_path=kepler_path,
        k2_path=k2_path,
        tess_path=tess_path,
        data_folder=processed_data_folder,
    )
    df = data_loader.merge_data()
    if df is None or df.empty:
        logger.error("Failed to load and merge data.")
        return

    logger.info("\n[STEP 2/5] Generating visualizations...")
    try:
        data_visualizer = EXODataVisualizer(df)
        data_visualizer.visualize_data()
        logger.info(f"Visualizations saved to: reports/figures/")
    except Exception as e:
        logger.warning(f"Visualization failed: {e}. Continuing")

    logger.info("\n[STEP 3/5] Preprocessing data...")
    data_preprocessor = DataPreprocessor(
        dataframe=df, data_folder=processed_data_folder, imputation_strategy="knn"
    )
    data_preprocessor.processing_pipeline()


if __name__ == "__main__":
    main()
