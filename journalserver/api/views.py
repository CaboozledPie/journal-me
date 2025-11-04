from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.contrib.auth.models import User

# Create your views here.
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def protected_view(request):
    print("=== REQUEST HEADERS ===")
    for k, v in request.headers.items():
        print(f"{k}: {v}")
    print("=======================")
    return Response({"message": f"Hello {request.user.username}, you are authenticated!"})
