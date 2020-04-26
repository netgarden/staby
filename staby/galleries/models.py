import os.path
from django.db import models
from django.conf import settings
from django.urls import reverse

from staby.media.fields import FileBrowseField
from staby.media.manager import File
from staby.pages.models import Page


class Gallery(Page):

    class Meta:
        staby_urls = 'staby.galleries.urls'

    @property
    def published_folders(self):
        return self.folders.filter(published=True)


class Folder(models.Model):

    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name='folders')
    slug = models.SlugField(max_length=255)
    title = models.CharField(max_length=255)
    image = FileBrowseField(max_length=255)
    dirname = models.CharField(max_length=255)
    published = models.BooleanField()
    order = models.PositiveIntegerField(default=0, blank=False, null=False)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-order']

    def get_files(self):

        gallery_path = os.path.join(settings.MEDIA_ROOT, self.dirname)
        gallery_path_real = os.path.join(settings.MEDIA_ROOT, gallery_path)

        allowed_extensions = ['jpg', 'jpeg', 'bmp', 'png', 'gif']

        files = [
            File(entry, self.dirname) for entry in os.scandir(gallery_path_real)
            if any(entry.name.lower().endswith(ext) for ext in allowed_extensions)
        ]

        return files

    def get_absolute_url(self):

        gallery_url = self.gallery.get_absolute_url()
        if gallery_url.endswith('/'):
            gallery_url = gallery_url[:-1]

        folder_url = reverse('gallery_folder_detail', 'staby.galleries.urls', [self.slug])

        return gallery_url + folder_url

    def __str__(self):
        return f"Folder '{self.title}'"
