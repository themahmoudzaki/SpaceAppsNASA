from django.urls import path
from . import views
urlpatterns = [
    path("", views.home, name="root"),
    path("login/", views.login_view, name="login"),
    path("auth/login/", views.login_request, name="auth_login"),
    path("sign-up/", views.sign_up_view, name="sign_up"),
    path("auth/sign-up/", views.sign_up_request, name="auth_login"),
]