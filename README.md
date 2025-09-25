# 🌌 ExoPlanet Hunter AI
**Project for NASA Space Apps Challenge 2025**

## **Project Name:** *Nimbus Nexus*

**Version:** 0.3

**Tagline:** A full-stack application using a stacking ML model to automatically analyze NASA's open-source mission data and hunt for new worlds.

---

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [The Challenge](#the-challenge)
3.  [System Architecture](#system-architecture)
4.  [Quick Start (Local Deployment)](#quick-start-local-deployment)
5.  [Project Structure](#project-structure)
6.  [Implementation Status](#implementation-status)
7.  [API Documentation](#api-documentation)
8.  [Contributing](#contributing)
9.  [License](#license)
10. [Support](#support)

---

## Project Overview

**ExoPlanet Hunter AI** is a comprehensive, full-stack application designed to automate the discovery of exoplanets from NASA's vast open-source datasets. This project leverages a powerful stacking ensemble of machine learning models to analyze data from the **Kepler, K2, and TESS missions**, aiming to accurately classify planetary candidates.

The application is containerized using Docker and consists of three main parts:
1.  A **Machine Learning Core** for data processing and model training.
2.  A **Python Backend** to serve the trained model via a REST API.
3.  A **Web Frontend** for user interaction and data visualization.

---

## The Challenge

This project directly addresses the ["A World Away: Hunting for Exoplanets with AI"](https://www.spaceappschallenge.org/2025/challenges/a-world-away-hunting-for-exoplanets-with-ai/?tab=details) challenge from the NASA Space Apps Challenge 2025. The core objective is to create an AI/ML model with a web interface to facilitate user interaction and the discovery of new exoplanets.

---

## System Architecture

The entire application is designed to be run as a set of orchestrated services using Docker Compose, ensuring a clean separation of concerns and easy deployment.



1.  **Machine Learning Core (`backend/ml`)**
    * **Data Pipeline:** Ingests and processes raw data from NASA missions.
    * **Model Training:** Employs a stacking ensemble (XGBoost, LightGBM, MLP) to train a highly accurate classification model.
    * **Artifacts:** Produces a trained model file that is used by the backend service.

2.  **Backend (`backend`)**
    * **Technology:** A Python web framework (e.g., FastAPI, Flask) serves the application's logic.

3.  **Frontend (`frontend`)**
    * **Technology:** A modern JavaScript framework (e.g., React, Vue, Svelte) to build a dynamic and responsive user interface.
    * **Functionality:** Allows users to upload data, view classification results, and interact with visualizations.
    * **Communication:** Interacts with the backend via API calls to get predictions.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

Read the documentation in the /docs folder.
If you encounter a bug or have a feature request, please open an issue on the GitHub repository.