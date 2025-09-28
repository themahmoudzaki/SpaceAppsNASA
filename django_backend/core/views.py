from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
import json
from django.contrib.auth.models import User

# Create your views here.

def home(request):
    if request.user.is_authenticated:
        return render(request, "html/home.html")
    else:
        return redirect("/login")

def sign_up_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            if User.objects.filter(username=username).exists():
                return JsonResponse({"status": "username already exists", "success": False}, status=401)
            else:
                user = User.objects.create_user(username, password=password)
                user.save()
                login(request, user)
                return JsonResponse({"status": "sign up successful", "success": True})
        except json.JSONDecodeError:
            return JsonResponse({"status": "bad json", "success": False}, status=400)

    return JsonResponse({"status": "invalid request", "success": False}, status=405)

def login_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"status": "logged in", "success": True})
            else:
                return JsonResponse({"status": "invalid credentials", "success": False}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"status": "bad json", "success": False}, status=400)

    return JsonResponse({"status": "invalid request", "success": False}, status=405)

def login_view(request):
    return render(request, "html/login.html")

def sign_up_view(request):
    return render(request, "html/sign_up.html")

@login_required
def home_view(request):
    return render(request, "html/home.html")
