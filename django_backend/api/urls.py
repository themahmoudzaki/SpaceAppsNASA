from django.urls import path
from .views import ExoPlanetDataView, PublicPredictView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("exo-planet/", ExoPlanetDataView.as_view(), name="exoplanets"),
    path("predict/public/", PublicPredictView.as_view(), name="predict_public"), # NO auth
]
