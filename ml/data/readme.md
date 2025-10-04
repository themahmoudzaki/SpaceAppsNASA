# 🪐 Exoplanet Mission Datasets Guide

This guide provides an overview of the datasets used in this project, sourced from NASA's most successful exoplanet-hunting missions: **Kepler**, **K2**, and **TESS**.

All three missions operate by using the **transit method**. They stare at thousands of stars, looking for tiny, periodic dips in starlight caused by a planet passing in front of its star. The characteristics of this dip tell us a great deal about the planet and its orbit.

---

## **Raw Mission Datasets**

### **1. Kepler Mission Dataset**

> Kepler was the pioneering mission that revolutionized exoplanet science. It stared at one patch of sky for years, providing a rich, deep dataset that is still a gold standard for training machine learning models.

* **File:** `kepler_captured_data.csv`
* **Size:** 9,565 Rows, 140 Columns

#### **Key Columns Explained:**

* `koi_disposition`: **(Target Variable)** The final classification of the object.
    * `CONFIRMED`: Verified exoplanet.
    * `CANDIDATE`: Likely a planet, but not yet fully confirmed.
    * `FALSE POSITIVE`: The signal was caused by something else, like a background eclipsing binary star.
* `koi_period`: **Orbital Period (days)** - How long the planet takes to complete one orbit around its star.
* `koi_duration`: **Transit Duration (hours)** - How long the transit (the dip in starlight) lasts.
* `koi_depth`: **Transit Depth (ppm)** - How much the star's light dims, measured in parts per million. Deeper transits suggest larger planets.
* `koi_prad`: **Planetary Radius (Earth radii)** - The estimated radius of the planet compared to Earth.
* `koi_steff`: **Stellar Temperature (Kelvin)** - The surface temperature of the host star.
* `koi_model_snr`: **Signal-to-Noise Ratio** - A measure of the transit signal's strength compared to the random noise. Higher is better.

---

### **2. K2 Mission Dataset**

> After a mechanical failure, the Kepler telescope was repurposed for the K2 mission. It could no longer stare at a single spot, so it scanned different areas of the sky, discovering many new exoplanets near and far.

* **File:** `K2_mission_captured_data.csv`
* **Size:** 3,993 Rows, 294 Columns

#### **Key Columns Explained:**

* `disposition`: The classification of the object (same as Kepler).
* `pl_orbper`: Orbital Period (days).
* `pl_trandur`: Transit Duration (hours).
* `pl_trandep`: Transit Depth (%).
* `pl_rade`: Planet Radius (in Earth Radius).
* `st_teff`: Stellar Effective Temperature (Kelvin).

---

### **3. TESS Mission Dataset**

> The Transiting Exoplanet Survey Satellite (TESS) is Kepler's successor. It is surveying almost the entire sky, focusing on the nearest and brightest stars to find exoplanets that are ideal for follow-up studies.

* **File:** `TESS_mission_captured_data.csv`
* **Size:** 7,669 Rows, 86 Columns

#### **Key Columns Explained:**

* `tfopwg_disp`: The classification from the TESS Follow-up Observing Program Working Group.
    * `CP`: Confirmed Planet
    * `FP`: False Positive
    * `PC`: Planetary Candidate
* `pl_orbper`: Planet Orbital Period (days).
* `pl_trandurh`: Planet Transit Duration (hours).
* `pl_trandep`: Planet Transit Depth (ppm).
* `pl_rade`: Planet Radius (in R\_Earth).
* `st_teff`: Stellar Effective Temperature (Kelvin).

---
---

## **Data Pipeline & Processing** 🛠️

These scripts handle the ingestion, cleaning, feature engineering, and splitting of the raw data into a format ready for machine learning.

### **1. Data Loading and Merging (`data_loader_and_merger.py`)**

* **Role:** This module is responsible for loading the three mission datasets and consolidating them into a single, unified DataFrame.
* **Key Actions:**
    * **Standardization:** Maps the disparate column names (e.g., `koi_period`, `pl_orbper`) across the three files to a consistent set of standardized feature names (`period`, `duration`, `depth`, etc.).
    * **Source Tracking:** Adds a `source` column to track which mission the original observation came from (Kepler, K2, or TESS).
    * **Output:** Creates the **`Merged_data.csv`** file.

### **2. Data Preprocessing (`data_preprocessor.py`)**

* **Role:** This module takes the merged dataset and executes all steps necessary to prepare the data for training a model.
* **Key Actions:**
    * **Cleaning:** Removes observations with non-standard or missing target labels.
    * **Imputation:** Fills in missing numerical values using techniques like k-Nearest Neighbors (KNN) imputation.
    * **Feature Engineering:** Creates **26 final features** (e.g., interaction terms like `period_depth_interaction`, log-transformed features like `log_period`, and physical parameters like `transit_signal_strength`).
    * **Encoding:** Converts the string target variable (`disposition`) into a numerical, integer-encoded format: **0** (`FALSE POSITIVE`), **1** (`CANDIDATE`), **2** (`CONFIRMED`).
    * **Splitting:** Generates the final **ML-Ready Splits** (`X_train.csv`, `y_train.csv`, `X_cv.csv`, etc.).

### **3. Data Visualization (`data_visualizer.py`)**

* **Role:** This module is used for Exploratory Data Analysis (EDA) on the merged dataset.
* **Key Actions:**
    * Generates various plots (histograms, scatter plots, PCA plots) to help understand feature distributions, correlations, and class separability *before* model training begins.
    * Uses **Seaborn** and **Matplotlib** for visualization.

---

## **Processed/ML-Ready Datasets** 🚀

This section describes the data that has been cleaned, merged, and pre-processed for machine learning model training.

### **1. Merged Dataset (`Merged_data.csv`)**

This file is a cleaned and combined version of the three raw mission datasets. It serves as the foundation for the feature engineering process.

* **File:** `Merged_data.csv`
* **Size:** 21,267 Rows, 10 Columns
* **Key Columns:** `period`, `duration`, `depth`, `planet_radius`, `disposition`, `semi_major_axis`, `source`, `star_radius`, `teff`, `logg`.

### **2. Machine Learning Splits**

The cleaned data was used to engineer a comprehensive set of features and then split into training, cross-validation (CV), and test sets.

* **Features (X files):** `X_train.csv`, `X_cv.csv`, `X_test.csv`
    * **Size (Train):** 9,482 Rows, **26 Columns**
    * **Structure:** Includes original, normalized, log-transformed, and interaction features. All missing values have been imputed, and categorical features encoded.
    * **Example Features:** `period`, `duration`, `depth`, `planet_radius`, `teff` (original), plus engineered features like `log_period`, `radius_ratio`, `period_depth_interaction`, and more.

* **Target (y files):** `y_train.csv`, `y_cv.csv`, `y_test.csv`
    * **Size (Train):** 9,482 Rows, **1 Column**
    * **Structure:** A one-column vector containing the **integer-encoded disposition** for each observation.
    * **Disposition Mapping (Target Variable):**
        * **0**: `FALSE POSITIVE`
        * **1**: `CANDIDATE`
        * **2**: `CONFIRMED`

---

## **How to Load the Data**

The raw mission CSV files contain commented header lines that must be skipped. The processed ML-ready files (`X_*` and `y_*`) are ready to load directly.

```python
import pandas as pd

# Define the file paths for the raw data
KEPLER_FILE = 'kepler_captured_data.csv'
K2_FILE = 'K2_mission_captured_data.csv'
TESS_FILE = 'TESS_mission_captured_data.csv'

# Define the file paths for the processed ML data
X_TRAIN_FILE = 'X_train.csv'
Y_TRAIN_FILE = 'y_train.csv'
# Similar file names for CV and test sets...

try:
    # Load the Kepler dataset, skipping the comment lines at the top
    kepler_df = pd.read_csv(KEPLER_FILE, comment='#')
    print("Raw Kepler Data Loaded Successfully!")
    print(f"Shape: {kepler_df.shape}\n")

    # Load the ML training data (no comment skipping needed)
    X_train = pd.read_csv(X_TRAIN_FILE)
    y_train = pd.read_csv(Y_TRAIN_FILE)
    print("ML Training Data Loaded Successfully!")
    print(f"X_train Shape: {X_train.shape}")
    print(f"y_train Shape: {y_train.shape}")


except FileNotFoundError as e:
    print(f"Error: Could not find the file: {e.filename}")