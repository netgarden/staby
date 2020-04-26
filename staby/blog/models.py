from django.db import models
from django.urls import reverse

from staby.core.fields import RichTextField
from staby.media.fields import FileBrowseField
from staby.pages.models import Displayable, Page


class Blog(Page):
    
    class Meta:
        staby_urls = 'staby.blog.urls'

    def published_posts(self):
        return Displayable.filter_published(self.posts)
    


class BlogPost(Displayable):

    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='posts')

    teaser_image = FileBrowseField(max_length=255, null=True, blank=True)
    teaser  = RichTextField()

    content = RichTextField()

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):

        blog_url = self.blog.get_absolute_url()
        if blog_url.endswith('/'):
            blog_url = blog_url[:-1]

        post_url = reverse('blog_post_detail', 'staby.blog.urls', [self.slug])

        return blog_url + post_url
