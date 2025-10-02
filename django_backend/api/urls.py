from django.urls import path
from .views import PredictView, ExoPlanetDataView, SignUpView, predict_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("", ExoPlanetDataView.as_view(), name="index"),
    path("signup/", SignUpView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("predict/", PredictView.as_view(), name="predict"),
path("api/predict/", predict_view, name="predict"),
]
