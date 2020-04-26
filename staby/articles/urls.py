from django.urls import path

from .views import article_detail

urlpatterns = [
    path('<slug:slug>/', article_detail, name='article_detail'),
]

