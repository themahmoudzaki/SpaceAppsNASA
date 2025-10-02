from pathlib import Path
from ..prediction_service import PredictionService

MODEL_DIR = Path(__file__).resolve().parent.parent.parent / "models"

service = None  # placeholder

def get_service():
    global service
    if service is None:
        service = PredictionService(MODEL_DIR)
    return service
