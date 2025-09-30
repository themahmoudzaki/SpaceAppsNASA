import os
from dotenv import load_dotenv
from src.data.data_loader_and_merger import ExoPlanetData
from src.data.data_visualizer import EXODataVisualizer
from src.data.data_preprocessor import DataPreprocessor

load_dotenv()


def main():

    from pathlib import Path

    data_folder = Path("data")
    k2_path = data_folder / "K2_mission_captured_data.csv"
    kepler_path = data_folder / "kepler_captured_data.csv"
    tess_path = data_folder / "TESS_mission_captured_data.csv"

    data_loader = ExoPlanetData(
        kepler_path=kepler_path,
        k2_path=k2_path,
        tess_path=tess_path,
        data_folder=data_folder / "processed",
    )
    df = data_loader.merge_data()

    data_visualizer = EXODataVisualizer(df)
    data_visualizer.visualize_data()

    data_preprocessor = DataPreprocessor(df)
    data_preprocessor.processing_pipeline()


if __name__ == "__main__":
    main()
