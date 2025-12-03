from django.shortcuts import render

from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from .models import JournalEntry

def test_view(request):
    return HttpResponse("Journal app is working!")

@csrf_exempt
@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def entry_list(request):
    user = request.user

    if request.method == 'GET':
        entries = JournalEntry.objects.filter(user=user).values('id', 'title', 'content', 'created_at')
        return Response({"entries": list(entries)})

    elif request.method == 'POST':
        title = request.data.get('title')
        content = request.data.get('content')

        if not title or not content:
            return Response({"error": "Missing title or content"}, status=status.HTTP_400_BAD_REQUEST)

        entry = JournalEntry.objects.create(user=user, title=title, content=content)
        return Response(
            {"id": entry.id, "title": entry.title, "content": entry.content},
            status=status.HTTP_201_CREATED
        )

@csrf_exempt
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_entry(request):
    
    user = request.user
    pk= request.data.get('entry-id')

    try:
        entry = JournalEntry.objects.get(pk=pk, user=user)
    except JournalEntry.DoesNotExist:
        return Response({"error": "Not found or not yours"}, status=404)

    entry.delete()
    return Response({"success": True})
