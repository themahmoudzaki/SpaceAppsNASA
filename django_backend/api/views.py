from django.shortcuts import render
# Create your views here.
from rest_framework import generics
from . import models
from . import serializers
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.views import APIView
class ExoPlanetDataView(generics.ListCreateAPIView):
    queryset = models.ExoPlanetData.objects.all()
    serializer_class = serializers.ExoPlanetDataSerializer


from pathlib import Path
from django.conf import settings
from .prediction_service import PredictionService

# Correctly point to the models folder
model_dir = Path(settings.BASE_DIR) / "models"
service = PredictionService(model_dir)




class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                username=serializer.validated_data["username"],
                email=serializer.validated_data.get("email", ""),
                password=serializer.validated_data["password"]  # hashed automatically
            )
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.predictor import get_service

class PredictView(APIView):
    def post(self, request):
        try:
            features = request.data.get("features")
            if not features:
                return Response({"error": "Missing 'features' in request body"},
                                status=status.HTTP_400_BAD_REQUEST)

            service = get_service()  # lazy load
            result = service.predict_single(features)

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
from pathlib import Path

model_dir = Path("models")

@csrf_exempt
def predict_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    try:
        data = json.loads(request.body)

        # Get feature names from ensemble_info
        feature_names = service.ensemble_info.get("feature_names")
        if not feature_names:
            # fallback: assume 5 features
            feature_names = [f"f{i}" for i in range(len(data[0]))]

        df = pd.DataFrame(data, columns=feature_names)

        results = service.predict_from_dataframe(df, return_proba=True)

        if "probabilities" in results:
            results["probabilities"] = results["probabilities"].to_dict(orient="records")

        return JsonResponse(results)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
