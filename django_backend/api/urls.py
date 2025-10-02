from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path("", views.ExoPlanetDataView.as_view(), name="index"),
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="login"),       # POST username + password
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]