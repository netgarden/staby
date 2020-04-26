from django.urls import path

from .views import folder_detail

urlpatterns = [
    path('<slug>/', folder_detail, name='gallery_folder_detail'),
]

