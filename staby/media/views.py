from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.urls import reverse

from .forms import *
from .manager import MediaListing, MediaManager

def browse(request):

    context = {}
    context['path'] = request.GET.get('path', None)

    context['entries'] = MediaListing(request)

    return render_to_response('staby/media/index.html', context=context)

def upload(request):

    path = request.GET.get('path', '')

    if request.method == 'POST':
        
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():

            manager = MediaManager(path)

            files = request.FILES.getlist('files')
            for f in files:
                manager.upload(f)

            redirect_url = reverse('media:media_browse')
            if path is not None:
                redirect_url += '?path=' + path
            
            return HttpResponseRedirect(redirect_url)

    else:
        form = UploadFileForm(initial={'path': path})

    return render(request, 'staby/media/upload.html', {'form': form})

def createFolder(request):

    path = request.GET.get('path', '')

    if request.method == 'POST':
        
        form = CreateFolderForm(request.POST)
        if form.is_valid():

            manager = MediaManager(path)
            manager.mkdir(form.cleaned_data['name'])

            redirect_url = reverse('media:media_browse')
            if path is not None:
                redirect_url += '?path=' + path
            
            return HttpResponseRedirect(redirect_url)

    else:
        form = CreateFolderForm(initial={'path': path})

    return render(request, 'staby/media/folder_create.html', {'form': form})

def delete(request):

    path = request.GET.get('path', '')
    item = request.GET['item']
    ok   = request.GET.get('ok', None)

    if ok is not None:

        redirect_url = reverse('media:media_browse')
        if path is not None:
            redirect_url += '?path=' + path

        if ok == '1':

            manager = MediaManager(path)
            manager.delete(item)

        return HttpResponseRedirect(redirect_url)

    context = {
        'path': path,
        'item': item
    }

    return render(request, 'staby/media/delete.html', context)

def rename(request):

    path = request.GET.get('path', '')
    item = request.GET['item']

    if request.method == 'POST':
        
        form = RenameForm(request.POST)
        if form.is_valid():

            manager = MediaManager(path)
            manager.rename(item, form.cleaned_data['name'])

            redirect_url = reverse('media:media_browse')
            if path is not None:
                redirect_url += '?path=' + path
            
            return HttpResponseRedirect(redirect_url)

    else:
        form = RenameForm(initial={'name': item})

    context = {
        'form': form,
        'path': path,
        'item': item,
    }

    return render(request, 'staby/media/rename.html', context)
