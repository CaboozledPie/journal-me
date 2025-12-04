from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("google/", views.google_auth, name="google"),
    path("test-auth/", views.test_auth, name="test-auth"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
