import re

from django.http import HttpResponse, Http404
from django.urls.resolvers import get_resolver
from django.shortcuts import render

from .models import Page


def dispatch(request, path):

    pages_data = Page.published.values('pk', 'parent_id', 'slug')
    pages = {(page['parent_id'], page['slug'],): page['pk'] for page in pages_data}

    parent_page_pk = None
    page_pk = None
    path_rest = None
    last_slash_index = 0

    chunks = []
    page_ids = []

    while True:

        slash_index = path.find('/', last_slash_index + 1)

        chunk_end = slash_index
        if slash_index == -1:
            chunk_end = len(path)

        chunk = path[last_slash_index:chunk_end]

        try:
            page_pk = pages[(parent_page_pk, chunk)]
        except KeyError:

            if parent_page_pk is None:

                try:
                    page_pk = pages[(parent_page_pk, '')]
                except KeyError:
                    raise Http404

                chunk = ''
                slash_index = -1

            path_rest = path[last_slash_index:]
            break

        if slash_index == -1 or slash_index == (len(path) - 1):
            break

        chunks.append(chunk)
        last_slash_index = slash_index + 1
        parent_page_pk = page_pk
        page_ids.append(page_pk)

    try:
        page = Page.objects.get(pk=page_pk)
        real_page = page.get_real_instance()
    except Page.DoesNotExist:
        raise Http404

    page_ids.append(page_pk)
    request.page_ids = page_ids

    if path_rest is None or len(path_rest) == 0:

        templates = [
            'pages/{}'.format(get_template_name(chunks)),
            'pages/{}.html'.format(real_page.__class__.__name__.lower()),
            'pages/page.html'
        ]

        return render(request, templates, {'page': real_page})

    page_urls = getattr(real_page._meta, 'staby_urls', None)
    if page_urls is None:
        raise Http404

    return dispatch_urls(request, real_page, page_urls, path_rest)


def dispatch_urls(request, page, urls, path_rest):

    resolver = get_resolver(urls)
    resolver_match = resolver.resolve('/' + path_rest)
    callback, callback_args, callback_kwargs = resolver_match
    request.resolver_match = resolver_match

    callback_args = (page, ) + callback_args

    response = callback(request, *callback_args, **callback_kwargs)

    return response


def get_template_name(chunks):

    pattern = re.compile('[^a-zA-Z0-9_\\-]+')

    ret = []

    for chunk in chunks:

        tmp = chunk.replace(' ', '-')
        tmp = pattern.sub('', tmp)

        if tmp == '':
            tmp = 'index'

        ret.append(tmp)

    return '/'.join(ret) + '.html'
