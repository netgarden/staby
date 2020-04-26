from django.shortcuts import render
from django.http import Http404

from .models import BlogPost


def post_detail(request, blog, slug):

    try:
        post = BlogPost.published.get(slug=slug, blog=blog)
    except BlogPost.DoesNotExist:
        raise Http404

    context = {
        'blog': blog,
        'post': post,
    }

    return render(request, 'blog/post.html', context)
