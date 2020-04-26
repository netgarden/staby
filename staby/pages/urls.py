from django.urls import re_path

from .dispatcher import dispatch

urlpatterns = [
    re_path(r'(.*)', dispatch),
]