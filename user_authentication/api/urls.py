from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test),
    path('login/', views.user_login),
    path('signup/', views.user_signup),
]