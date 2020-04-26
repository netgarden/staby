from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from ..core.admin import StabyModelAdminMixin
from ..pages.admin import PageChildModelAdmin
from .models import Category, Articles, Article


@admin.register(Articles)
class RichTextPageAdmin(PageChildModelAdmin):
    base_model = Articles


@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    # specify pixel amount for this ModelAdmin only:
    # mptt_level_indent = 20
    pass


@admin.register(Article)
class ArticleAdmin(StabyModelAdminMixin, admin.ModelAdmin):
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'category')
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
