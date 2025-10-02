import os
from dotenv import load_dotenv
from pathlib import Path

from src.data.data_loader_and_merger import ExoPlanetData
from src.data.data_visualizer import EXODataVisualizer
from src.data.data_preprocessor import DataPreprocessor
from src.models.model_trainer import StackedEnsembleTrainer
from src.utils.common import setup_logger


load_dotenv()

LOGGER_FILE_PATH = Path("reports") / "logs" / "Data_loader_merger.log"
logger = setup_logger("Main", LOGGER_FILE_PATH)


def main():
    logger.info("=" * 80)
    logger.info("EXOPLANET CLASSIFICATION PIPELINE - NASA SPACE APPS COMPETITION")
    logger.info("=" * 80)

    models_folder = Path("models")

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
    model_data = data_preprocessor.processing_pipeline()

    logger.info("\n[STEP 4/5] Training stacked ensemble model...")
    logger.info("Base models: XGBoost + LightGBM + MLP")
    logger.info("Meta-model: Neural Network")

    trainer = StackedEnsembleTrainer(model_data=model_data, save_folder=models_folder)

    results = trainer.train_pipeline()

    logger.info("\n[STEP 5/5] Final Results")
    logger.info("=" * 80)

    logger.info(f"Test Accuracy: {results['test_accuracy']:.4f}")
    logger.info(f"\nClassification Report:\n{results['classification_report']}")
    logger.info(f"\nConfusion Matrix:\n{results['confusion_matrix']}")

    logger.info("\n" + "=" * 80)
    logger.info("PIPELINE COMPLETE!")

    logger.info("=" * 80)
    logger.info(f"Models saved to: {models_folder}")
    logger.info(f"Processed data saved to: {processed_data_folder}")
    logger.info(f"Logs saved to: reports/logs/")
    logger.info(f"Figures saved to: reports/figures/")

    return results


if __name__ == "__main__":
    try:
        main()
        print("Pipeline Executed")
    except Exception as e:
        logger.error(f"Pipeline failed with error: {e}", exc_info=True)
        raise
