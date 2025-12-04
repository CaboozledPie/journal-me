from django.contrib import admin
from django.urls import path, include
from .views import ping, protected_view, profile

urlpatterns = [
    path('ping/', ping, name='ping'),
    path('protected/', protected_view, name='protected'),
    path('profile/', profile, name='profile'),
]
