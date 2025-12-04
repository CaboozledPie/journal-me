from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_view),
    path('entries/', views.entry_list, name='entry-list'),
    path('delete-entry/', views.delete_entry, name='delete-entry'),
    path('add-tag/', views.add_tag, name='add-tag'),
]
