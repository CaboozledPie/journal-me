from django.shortcuts import render

from django.http import HttpResponse
from django.http import JsonResponse

def test_view(request):
    return HttpResponse("Journal app is working! 🚀")

def entry_list(request):
    data = {
        "entries": [
            {"id": 1, "title": "First Journal", "content": "I learned Django!"},
            {"id": 2, "title": "Second Journal", "content": "Backend is cool."},
        ]
    }
    return JsonResponse(data)