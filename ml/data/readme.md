# 🪐 Exoplanet Mission Datasets Guide

This guide provides an overview of the three key datasets used in this project, sourced from NASA's most successful exoplanet-hunting missions: **Kepler**, **K2**, and **TESS**.

All three missions operate by using the **transit method**. They stare at thousands of stars, looking for tiny, periodic dips in starlight caused by a planet passing in front of its star. The characteristics of this dip tell us a great deal about the planet and its orbit.



---

### **1. Kepler Mission Dataset**

> Kepler was the pioneering mission that revolutionized exoplanet science. It stared at one patch of sky for years, providing a rich, deep dataset that is still a gold standard for training machine learning models.

* **File:** `kepler_captured_data.csv`
* **Size:** 9,565 Rows, 140 Columns

#### **Key Columns Explained:**

* `koi_disposition`: **(Target Variable)** The final classification of the object. This is what your model will learn to predict.
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

### **How to Load the Data**

The CSV files contain commented header lines that must be skipped. You can easily load the data using `pandas` by specifying the `comment` parameter.

```python
import pandas as pd

# Define the file paths
KEPLER_FILE = 'data/kepler_captured_data.csv'
K2_FILE = 'data/K2_mission_captured_data.csv'
TESS_FILE = 'data/TESS_mission_captured_data.csv'

try:
    # Load the Kepler dataset, skipping the comment lines at the top
    kepler_df = pd.read_csv(KEPLER_FILE, comment='#')

    # Print the shape and first few rows to verify it loaded correctly
    print("Kepler Data Loaded Successfully!")
    print(f"Shape: {kepler_df.shape}")
    print("\nFirst 5 Rows:")
    display(kepler_df.head())

except FileNotFoundError:
    print(f"Error: Could not find the file at {KEPLER_FILE}")