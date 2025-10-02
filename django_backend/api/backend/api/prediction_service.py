from fastapi import APIRouter
import asyncio
from services.prediction_service import PredictionService
prediction_router = APIRouter()

@prediction_router.post('/predict')
async def predict():
    print('Calling Model')
    model = PredictionService()
    


__all__ = ["prediction_router"]