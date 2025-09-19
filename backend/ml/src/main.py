import os
from dotenv import load_dotenv
from data.data_loader_and_merger import ExoPlanetData
from data.data_visualizer import EXODataVisualizer
load_dotenv()


def main():
    k2_path = os.getenv("K2_DATA_PATH", "ml/K2_mission_captured_data.csv")
    kepler_path = os.getenv("KEPLER_DATA_PATH", "ml/kepler_captured_data.csv")
    tess_path = os.getenv("TESS_DATA_PATH", "ml/TESS_mission_captured_data.csv")

    data_loader = ExoPlanetData(
        kepler_path=kepler_path, k2_path=k2_path, tess_path=tess_path
    )
    df = data_loader.merge_data()
    data_visualizer = EXODataVisualizer(df)
    


if __name__ == "__main__":
    main()
