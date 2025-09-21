import pandas as pd

class ExoPlanetData:
    def __init__(self, kepler_path, k2_path, tess_path):
        self.kepler_path = kepler_path
        self.k2_path = k2_path
        self.tess_path = tess_path
    
    def load_data(self, path):
        df = pd.read_csv(path, comment='#')
        print('Loaded Data')
        print(df.shape)
        print(df.head())

        return self._standardize_data(df)
    
    def _standardize_data(dataframe): pass
    
    def merge_data(self):
        df_kepler = self.load_data(self.kepler_path)
        df_k2 = self.load_data(self.k2_path)
        df_tess = self.load_data(self.tess_path)

__all__ = ["ExoPlanetData"]