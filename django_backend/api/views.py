from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth.models import User

from . import models
from . import serializers
from .serializers import UserSerializer
from .services.predictor import get_service

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
            User.objects.create_user(
                username=serializer.validated_data["username"],
                email=serializer.validated_data.get("email", ""),
                password=serializer.validated_data["password"]
            )
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



def do_prediction(request):
    """
    Shared prediction logic for both authenticated and public endpoints.
    Accepts 'features' key (list or list of lists for batch).
    """
    features = request.data.get("features")
    if features is None:
        return Response({"error": "Missing 'features' in request body"},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        # Use the PredictionService instance already created above
        # Handle single sample vs batch
        if isinstance(features[0], (float, int)):
            # Single prediction
            result = service.predict_single(features)
            return Response(result, status=status.HTTP_200_OK)
        else:
            # Batch prediction
            import pandas as pd
            feature_names = service.ensemble_info.get("feature_names")
            if not feature_names:
                feature_names = [f"f{i}" for i in range(len(features[0]))]
            df = pd.DataFrame(features, columns=feature_names)
            results = service.predict_from_dataframe(df, return_proba=True)
            if "probabilities" in results:
                results["probabilities"] = results["probabilities"].to_dict(orient="records")
            return Response(results, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data  # raw list of dicts (batch) or dict (single)
        import pandas as pd
        try:
            # Always end up with a list, so pd.DataFrame works for both
            if isinstance(data, dict):  # single sample
                data = [data]
            df = pd.DataFrame(data)
            results = service.predict_from_dataframe(df, return_proba=True)
            if "probabilities" in results:
                results["probabilities"] = results["probabilities"].to_dict(orient="records")
            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PublicPredictView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        import pandas as pd
        try:
            if isinstance(data, dict):
                data = [data]
            df = pd.DataFrame(data)
            results = service.predict_from_dataframe(df, return_proba=True)
            if "probabilities" in results:
                results["probabilities"] = results["probabilities"].to_dict(orient="records")
            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
