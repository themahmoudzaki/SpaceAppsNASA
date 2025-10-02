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

