# 🌌 ExoPlanet Hunter AI

**Project for NASA Space Apps Challenge 2025**

## **Project Name:** *Exo X Hunter*

**Version:** 0.4
**Tagline:** A full-stack application powered by a stacking ML model to automatically analyze NASA’s open-source mission data and hunt for new worlds.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [The Challenge](#the-challenge)
3. [System Architecture](#system-architecture)
4. [Quick Start (Local Deployment)](#quick-start-local-deployment)
5. [Project Structure](#project-structure)
6. [Implementation Status](#implementation-status)
7. [API Documentation](#api-documentation)
8. [Contributing](#contributing)
9. [License](#license)
10. [Support](#support)

---

## 🚀 Project Overview

**ExoPlanet Hunter AI** is a full-stack AI system designed to **automate the discovery of exoplanets** from NASA’s open-source datasets.
Using a **stacking ensemble of ML models**, it analyzes mission data from **Kepler, K2, and TESS** to classify planetary candidates with higher accuracy.

The app is fully **containerized with Docker**, making it easy to run locally or deploy to the cloud.

### Components:

1. **Machine Learning Core** – preprocesses NASA mission data and trains the stacking ensemble (XGBoost, LightGBM, MLP).
2. **Backend (Python / FastAPI or Django)** – serves the trained ML model via a REST API.
3. **Frontend (React / Vue)** – interactive UI for data upload, visualization, and classification results.

---

## 🎯 The Challenge

This project addresses the [NASA Space Apps Challenge 2025 – "A World Away: Hunting for Exoplanets with AI"](https://www.spaceappschallenge.org/2025/challenges/a-world-away-hunting-for-exoplanets-with-ai/?tab=details).
The goal: **make exoplanet hunting accessible** with an AI model and an intuitive web interface.

---

## 🏗️ System Architecture

All components run as services orchestrated by **Docker Compose**:

```
                ┌───────────────┐
                │   NASA Datasets   │
                └───────────────┘
                         │
                ┌───────▼───────┐
                │  ML Core (Stack)  │
                │  XGBoost+LGBM+MLP │
                └───────▼───────┘
                         │ Model Artifacts
                ┌───────▼───────┐
                │   Backend (API)   │
                │   FastAPI/Django  │
                └───────▼───────┘
                         │ JSON API
                ┌───────▼───────┐
                │   Frontend (UI)   │
                │ React/Vue + Nginx │
                └───────────────┘
```

---

## ⚡ Quick Start (Local Deployment)

### Option 1: Manual
**Make sure to have [https://www.docker.com/](Docker) installed**
1. **Start services with Docker Compose**

   ```bash
   docker-compose up -d
   ```

2. **Access the app**

   * Frontend → [http://localhost](http://localhost)
   * Backend API → [http://localhost:8000](http://localhost:8000)

3. **Stop services**

   ```bash
   docker-compose down
   ```

---

### Option 2: One-click Start Scripts

For convenience, you can use the included startup scripts:

* **Windows:**
  Double-click [`start.bat`](start.bat)

* **Linux/macOS:**
  Run:

  ```bash
  chmod +x start.sh
  ./start.sh
  ```

Both scripts will:
✅ Run `docker-compose up`
✅ Open [http://localhost](http://localhost) automatically in your browser

---

## 📂 Project Structure

```
exo-x-hunter/
│── backend/
│   ├── ml/              # Data pipeline + ML training
│   ├── api/             # REST API (FastAPI/Django)
│   └── requirements.txt
│
│── frontend/            # React/Vue app for UI
│   └── package.json
│
│── docker-compose.yml   # Orchestration of services
│── start.bat            # Windows one-click startup
│── start.sh             # Linux/Mac one-click startup
│── README.md            # Documentation
│── LICENSE
```

---

## 🛠️ Implementation Status

* ✅ Dockerized backend (Django/FastAPI)
* ✅ REST API for predictions
* ✅ Frontend (React + Nginx) with Docker support
* ✅ ML pipeline (preprocessing + training + stacking ensemble)
* ✅ One-click startup scripts (`start.bat`, `start.sh`)
* 🚧 Model optimization & hyperparameter tuning
* 🚧 Advanced visualizations (interactive light curves, probability graphs)
* 🚧 Cloud deployment (AWS/GCP/Azure)

---

## 📡 API Documentation

The backend exposes REST endpoints such as:

* `POST /predict` → Upload mission data and get classification results.
* `GET /health` → Service health check.
* `GET /models/info` → Metadata about trained models.

(OpenAPI/Swagger docs auto-generated at `/docs` if using FastAPI).

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-xyz`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push and create a PR

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file.

---

## 🛸 Support

📖 Full documentation → see `/docs` folder.
🐛 Found a bug? → open an issue on GitHub.
💡 Want to contribute? → PRs are welcome!
