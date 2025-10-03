# 🌌 Exoplanet API Documentation

This API allows clients to:  
- Store and retrieve exoplanet discovery records.  
- Perform ML-based predictions on potential exoplanet data.  

---

## 🔹 Models

### `ExoPlanetData`
| Field        | Type   | Description                         |
|--------------|--------|-------------------------------------|
| `id`         | int    | Auto-incremented unique identifier. |
| `planet_name`| string | Name of the discovered exoplanet.   |
| `confidence` | string | Confidence score of discovery.      |

---

## 🔹 Authentication
Currently all endpoints are **public**. JWT authentication may be added in the future.  

---

## 🔹 Endpoints

### 1. **Get All Exoplanets / Create New**
`GET /exo-planet/`  
`POST /exo-planet/`

#### **GET Response (200 OK)**
```json
[
  {
    "id": 1,
    "planet_name": "Kepler-22b",
    "confidence": "0.95"
  },
  {
    "id": 2,
    "planet_name": "HD 209458 b",
    "confidence": "0.87"
  }
]
