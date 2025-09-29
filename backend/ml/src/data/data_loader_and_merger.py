import pandas as pd
from pathlib import Path
from typing import Optional
from ..utils.common import setup_logger


LOGGER_FILE_PATH = Path("reports") / "logs" / "Data_loader_merger.log"
logger = setup_logger("DataLoaderAndMerger", LOGGER_FILE_PATH)


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
    def __init__(
        self,
        kepler_path,
        k2_path,
        tess_path,
        data_folder: Optional[Path] = None,
    ):
        self.kepler_path = kepler_path
        self.k2_path = k2_path
        self.tess_path = tess_path
        self.data_folder = data_folder

    def load_data(self, path) -> pd.DataFrame:
        try:
            df = pd.read_csv(path, comment="#")
            logger.info(f"Successfully loaded data from {path} with shape {df.shape}")
            return self._standardize_data(df)
        except FileNotFoundError:
            logger.error(f"File not found: {path}. Skipping this source")
        except Exception as e:
            logger.error(f"An unexpected error occurred while loading {path}: {e}")
            return None

    @staticmethod
    def _standardize_data(df: pd.DataFrame) -> pd.DataFrame:
        rename_map = {}
        for standard_name, potential_names in TARGET_FEATURES.items():
            for potential_name in potential_names:
                if potential_name in df.columns:
                    rename_map[potential_name] = standard_name
                    break

        df_renamed = df.rename(columns=rename_map)
        final_cols = [
            col for col in TARGET_FEATURES.keys() if col in df_renamed.columns
        ]
        return df_renamed[final_cols]

    def merge_data(self) -> pd.DataFrame:
        dataframes_to_merge = []
        sources = {
            "Kepler": self.kepler_path,
            "K2": self.k2_path,
            "TESS": self.tess_path,
        }

        for source_name, path in sources.items():
            df = self.load_data(path)
            if df is not None and not df.empty:
                df["source"] = source_name
                dataframes_to_merge.append(df)

        if not dataframes_to_merge:
            logger.error(
                "No dataframes to merge. All sources might have failed to load."
            )
            return None

        merged_df = pd.concat(dataframes_to_merge, ignore_index=True, sort=False)
        logger.info(f"Merging complete. Final DataFrame shape: {merged_df.shape}")

        if self.data_folder:
            output_path = self.data_folder / "Merged_data.csv"
            try:
                output_path.parent.mkdir(parents=True, exist_ok=True)
                merged_df.to_csv(output_path, index=False)
                logger.info(f"Successfully saved merged data to {output_path}")
            except Exception as e:
                logger.error(f"Failed to save merged data to {output_path}: {e}")
        return merged_df


__all__ = ["ExoPlanetData"]
