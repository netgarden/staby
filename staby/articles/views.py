from django.shortcuts import render
from django.http import Http404

from .models import Article


def article_detail(request, slug):

    try:
        article = Article.objects.get(slug=slug)
    except Article.DoesNotExist:
        raise Http404

    context = {
        'article': article,
    }

    return render(request, 'pages/article.html', context)
