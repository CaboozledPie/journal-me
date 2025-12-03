from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class JournalUser(AbstractUser):
    google_sub = models.CharField(max_length=64, unique=True, null=True, blank=True)
    picture = models.URLField(blank=True, null=True)
    email = models.EmailField(unique=True)
    name = models.CharField()

    # extra features
    streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_entry_date = models.DateField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
