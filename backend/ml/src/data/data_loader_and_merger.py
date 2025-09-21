import pandas as pd
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),  # To print to console
        logging.FileHandler("data_processing.log"),  # To save to a file
    ],
)

TARGET_FEATURES = {
    "period": ["period", "orbper", "orbital_period", "koi_period", "pl_orbper"],
    "duration": [
        "duration",
        "transit_duration",
        "koi_duration",
        "pl_trandur",
        "trandur",
    ],
    "depth": ["depth", "tran_depth", "koi_depth", "depth_ppm"],
    "planet_radius": ["prad", "pl_rade", "koi_prad", "planet_radius", "radius"],
    "star_radius": ["st_rad", "st_radius", "stellar_radius", "radius_star", "r_star"],
    "snr": ["snr", "mes", "model_snr"],
    "teff": ["st_teff", "teff"],
    "logg": ["st_logg", "logg"],
    "kepid": ["kepid"],
    "koi": ["kepoi_name", "koi", "koi_name", "koi_id"],
    "tic": ["tic", "tic_id", "ticid"],
    "toi": ["toi", "toi_id"],
    "planet_name": ["pl_name", "planet_name"],
    "host_name": ["hostname", "host_name"],
    "disposition": ["koi_disposition", "disposition", "koi_pdisposition"],
    "semi_major_axis": ["sma", "koi_sma", "pl_orbsmax", "pl_orbsma"],
}


class ExoPlanetData:
    def __init__(self, kepler_path, k2_path, tess_path, data_folder):
        self.kepler_path = kepler_path
        self.k2_path = k2_path
        self.tess_path = tess_path
        self.data_folder = data_folder

    def load_data(self, path) -> pd.DataFrame:
        try:
            df = pd.read_csv(path, comment="#")
        except FileNotFoundError:
            logging.error(f"File not found: {path}. Skipping this source")
        logging.info(f"Loaded Data from {path}")
        logging.info(df.shape)
        logging.info(df.head())

        df = self._standardize_data(df)
        return df

    @staticmethod
    def _standardize_data(df: pd.DataFrame) -> pd.DataFrame:
        rename_map = {}
        df_copy = df.copy()

        for standard_name, potential_names in TARGET_FEATURES.items():
            for potential_name in potential_names:
                if potential_name in df_copy.columns:
                    rename_map[potential_name] = standard_name
                    break

        df_copy = df_copy.rename(columns=rename_map)
        final_cols = [col for col in TARGET_FEATURES.keys() if col in df_copy.columns]

        return df_copy[final_cols]

    def merge_data(self) -> pd.DataFrame:
        df_kepler = self.load_data(self.kepler_path)
        df_k2 = self.load_data(self.k2_path)
        df_tess = self.load_data(self.tess_path)

        df_kepler["source"] = "Kepler"
        df_k2["source"] = "K2"
        df_tess["source"] = "TESS"

        merged_df = pd.concat(
            [df_kepler, df_k2, df_tess],
            ignore_index=True,  # Creates a new clean index for the merged frame
            sort=False,  # Keeps the column order consistent
        )
        logging.info(f"Merging complete. Final DataFrame shape: {merged_df.shape}")
        logging.info(merged_df.head())

        self.output_path = self.data_folder / "Merged_data.csv"
        try:
            merged_df.to_csv(self.output_path, index=False)
            logging.info(f"Successfully saved merged data to {self.output_path}")
        except Exception as e:
            logging.error(f"Failed to save merged data to {self.output_path}: {e}")
        return merged_df


__all__ = ["ExoPlanetData"]
