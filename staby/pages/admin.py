from django.contrib import admin
from polymorphic_tree.admin import PolymorphicMPTTParentModelAdmin, PolymorphicMPTTChildModelAdmin

from ..core.admin import StabyModelAdminMixin
from .models import Page, RichTextPage, SubMenuPage


@admin.register(Page)
class PageAdmin(StabyModelAdminMixin, PolymorphicMPTTParentModelAdmin):

    list_display = [
        'title',
        'slug',
    ]

    def get_child_models(self):

        children = []

        registry = admin.site._registry
        for model in registry.keys():
            if model is not Page and issubclass(model, Page):
                children.append(model)

        return children


class PageChildModelAdmin(StabyModelAdminMixin, PolymorphicMPTTChildModelAdmin):
    pass


@admin.register(RichTextPage)
class RichTextPageAdmin(PageChildModelAdmin):
    base_model = RichTextPage


@admin.register(SubMenuPage)
class SubMenuPageAdmin(PageChildModelAdmin):
    base_model = SubMenuPage
