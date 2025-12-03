from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()

def check_streak(profile):
    if profile.last_entry_date < today - timedelta(days=1): # reset streak if it's been more than a day
        profile.streak = 0
    profile.longest_streak = max(profile.longest_streak, profile.streak)
    profile.save()

# Create your views here.
@api_view(['GET'])
def ping(request):
    return Response({"message": "pong!"})

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def protected_view(request):
    print("=== REQUEST HEADERS ===")
    for k, v in request.headers.items():
        print(f"{k}: {v}")
    print("=======================")
    return Response({"message": f"Hello {request.user.username}, you are authenticated!"})

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    try:
        profile = User.objects.get(email=user)
    except:
        return Response({"error": "failed to find profile"}, status=404)
    return Response( {
        "email": profile.email,
        "picture": profile.picture,
        "name": profile.name,
        "streak": profile.streak,
        "longest-streak": profile.longest_streak,
        "last-entry-date": profile.last_entry_date
    }, status=200)
