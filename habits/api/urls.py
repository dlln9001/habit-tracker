from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_habit),
    path('get/', views.get_habit),
    path('edit/', views.edit_habit),
    path('delete/', views.delete_habit),
    path('mark-complete/', views.mark_habit_complete),
]