from django.shortcuts import render
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

# Create your views here.

@api_view(['POST'])
def google_auth(request):
    token = request.data.get('token')
    try:
        # Verify token using Google's public keys
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
        )

        email = idinfo['email']
        name = idinfo.get('name', email)

        user, _ = User.objects.get_or_create(username=email, defaults={'first_name': name})

        return Response({"message": "Authenticated", "user": user.username})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
