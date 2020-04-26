from django.shortcuts import render
from django.http import Http404

from .models import Folder


def folder_detail(request, gallery, slug):

    try:
        folder = Folder.objects.get(gallery=gallery, slug=slug)
    except Folder.DoesNotExist:
        raise Http404

    context = {
        'gallery': gallery,
        'folder': folder,
    }

    return render(request, 'pages/gallery_folder.html', context)
