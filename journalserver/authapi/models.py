from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class JournalUser(AbstractUser):
    google_sub = models.CharField(max_length=64, unique=True, null=True, blank=True)
    picture = models.URLField(blank=True, null=True)
    email = models.EmailField(unique=True)
    name = models.CharField()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
