from django.shortcuts import render
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    token = request.data.get('token')
    try:
        # Verify token using Google's public keys
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            "219694033881-4od4hi84uakag1cf7fuucm6s6u8q7ef9.apps.googleusercontent.com"
        )

        google_id = idinfo["sub"]
        email = idinfo.get("email")
        name = idinfo.get('name', "")
        picture = idinfo.get("picture", "")

        user, created = User.objects.get_or_create(
            email = email,
            defaults = {
                "google_sub": google_id,
                "username": email,
                "name": name,
                "picture": picture,
            }
        )
        if not created:
            if user.google_sub is None:
                user.google_sub = google_id
            user.email = email
            user.name = name
            user.picture = picture
            user.save()

        # create token
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
        }
        )
    except Exception as e:
        return Response({"error": str(e)}, status=400)
