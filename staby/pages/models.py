from django.db import models
from polymorphic_tree.managers import PolymorphicMPTTModelManager
from polymorphic_tree.models import PolymorphicMPTTModel, PolymorphicTreeForeignKey

from staby.core.fields import RichTextField
from .utils import classproperty


class PublishedManager(models.Manager):
    def get_queryset(self):
        return Displayable.filter_published(super().get_queryset())


class Displayable(models.Model):

    slug  = models.SlugField(blank=True)
    title = models.CharField(max_length=255)

    is_published = models.BooleanField()
    published_from = models.DateTimeField(null=True, blank=True)
    published_to = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()
    published = PublishedManager()

    class Meta:
        abstract = True

    @classmethod
    def filter_published(cls, queryset):
        return queryset.filter(
            models.Q(is_published=True)
            &
            (
                models.Q(published_from__isnull=True) |
                models.Q(published_from__lte=models.functions.Now())
            )
            &
            (
                models.Q(published_to__isnull=True) |
                models.Q(published_to__gte=models.functions.Now())
            )
        )


class Page(PolymorphicMPTTModel, Displayable):

    show_in_menu = models.BooleanField('show in menu', default=True)

    objects = PolymorphicMPTTModelManager()

    parent = PolymorphicTreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    class Meta:
        constraints = [
            models.UniqueConstraint(name='u_page_page_slug', fields=['parent', 'slug'])
        ]

    def __str__(self):
        return self.title

    def get_absolute_url(self):

        url = None
        if self.parent is not None:
            url = self.parent.get_absolute_url()

        if url is None:
            url = '/'

        if self.slug != '':
            url += self.slug + '/'

        return url

    @classproperty
    @classmethod
    def subclass_object_choices(cls):
        """All known subclasses, keyed by a unique name per class."""
        return {
            rel.name: rel.related_model
            for rel in cls._meta.related_objects
            if rel.parent_link
        }

    @classproperty
    @classmethod
    def subclass_choices(cls):
        """Available subclass choices, with nice names."""
        return [
            (name, model._meta.verbose_name)
            for name, model in cls.subclass_object_choices.items()
        ]

    @classmethod
    def subclass(cls, name):
        "Given a subclass name, return the subclass."
        return cls.subclass_object_choices.get(name, cls)


class RichTextPage(Page):
    content = RichTextField()


class SubMenuPage(Page):
    pass
