from rest_framework import serializers
from .models import ExoPlanetData
from django.contrib.auth.models import User

class ExoPlanetDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExoPlanetData
        fields = "__all__"



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"