from django.shortcuts import render

from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import JournalEntry

def test_view(request):
    return HttpResponse("Journal app is working! 🚀")

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def entry_list(request):

    if request.method == 'GET':
        entries = JournalEntry.objects.all().values('id', 'title', 'content', 'created_at')
        return Response({"entries": list(entries)})

    elif request.method == 'POST':
        title = request.data.get('title')
        content = request.data.get('content')

        if not title or not content:
            return Response({"error": "Missing title or content"}, status=status.HTTP_400_BAD_REQUEST)

        entry = JournalEntry.objects.create(title=title, content=content)
        return Response(
            {"id": entry.id, "title": entry.title, "content": entry.content},
            status=status.HTTP_201_CREATED
        )