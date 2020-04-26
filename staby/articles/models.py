from django.db import models
from django.urls import reverse

from mptt.models import MPTTModel, TreeForeignKey

from staby.media.fields import FileBrowseField
from staby.core.fields import RichTextField
from staby.pages.models import Displayable, Page


class Category(MPTTModel):
    slug = models.SlugField(max_length=100, primary_key=True)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Articles(Page):
    
    category = TreeForeignKey(Category, null=True, blank=True, on_delete=models.PROTECT, related_name='articles_pages')

    def articles(self):
        
        queryset = Article.objects

        if self.category is not None:
            categories = self.category.get_descendants(True)
            queryset = queryset.filter(
                category__in=models.Subquery(categories.values('pk'))
            )

        queryset = Displayable.filter_published(queryset)

        return queryset


class Article(Displayable):

    slug  = models.SlugField(primary_key=True)

    category = TreeForeignKey(Category, on_delete=models.PROTECT, related_name='direct_articles')

    teaser_image = FileBrowseField(max_length=255, null=True, blank=True)
    teaser  = RichTextField()

    content = RichTextField()

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('article_detail', args=[self.slug])
