import os
from dotenv import load_dotenv
from data.data_loader_and_merger import ExoPlanetData
from data.data_visualizer import EXODataVisualizer

load_dotenv()


def main():
    #
    # Docker to be implemented
    #
    # k2_path = os.getenv("K2_DATA_PATH", "ml/data/K2_mission_captured_data.csv")
    # kepler_path = os.getenv("KEPLER_DATA_PATH", "ml/data/kepler_captured_data.csv")
    # tess_path = os.getenv("TESS_DATA_PATH", "ml/data/TESS_mission_captured_data.csv")

    from pathlib import Path

    data_folder = Path("..") / "data"
    k2_path = data_folder / "K2_mission_captured_data.csv"
    kepler_path = data_folder / "kepler_captured_data.csv"
    tess_path = data_folder / "TESS_mission_captured_data.csv"

    data_loader = ExoPlanetData(
        kepler_path=kepler_path,
        k2_path=k2_path,
        tess_path=tess_path,
        data_folder=data_folder,
    )
    df = data_loader.merge_data()
    data_visualizer = EXODataVisualizer(df)


if __name__ == "__main__":
    main()
