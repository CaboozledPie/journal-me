from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_view),

    # GET (list) + POST (create)
    path('entries/', views.entry_list, name='entry-list'),

    # POST delete endpoint
    path('delete/<int:pk>/', views.delete_entry, name='entry-delete'),

]