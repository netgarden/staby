from django.urls import path

from .views import post_detail

urlpatterns = [
    path('<slug:slug>/', post_detail, name='blog_post_detail'),
]

