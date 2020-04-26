from adminsortable2.admin import SortableInlineAdminMixin
from django.contrib import admin

from ..pages.admin import PageAdmin, PageChildModelAdmin
from .models import Gallery, Folder


class GalleryFolderInline(SortableInlineAdminMixin, admin.TabularInline):
    model = Folder


@admin.register(Gallery)
class RichTextPageAdmin(PageChildModelAdmin):
    base_model = Gallery
    inlines = (GalleryFolderInline,)
