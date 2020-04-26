from django.contrib import admin

from ..pages.admin import PageChildModelAdmin

from .models import Blog, BlogPost


@admin.register(Blog)
class RichTextPageAdmin(PageChildModelAdmin):
    base_model = Blog


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
            'fields': ('title', 'slug')
        }),
        ('Content', {
            #'classes': ('collapse',),
            'fields': ('teaser_image', 'teaser', 'content'),
        }),
        ('Publishing', {
            #'classes': ('collapse',),
            'fields': ('is_published', 'published_from', 'published_to'),
        }),
    )
