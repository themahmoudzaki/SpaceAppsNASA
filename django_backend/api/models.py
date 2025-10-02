from django.db import models

# Create your models here.
class ExoPlanetData(models.Model):
    id = models.AutoField(primary_key=True)
    planet_name = models.CharField(max_length=100)
