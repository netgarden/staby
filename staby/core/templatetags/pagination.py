from django import template as django_template
from django.core.paginator import Paginator
from django.template.loader import render_to_string

register = django_template.Library()


@register.simple_tag(takes_context=True)
def paginate(context, objects, number):

    request = context['request']
    page_num = request.GET.get('page')

    paginator = Paginator(objects, number)

    return paginator.get_page(page_num)


@register.simple_tag
def render_paginator(page_obj, template='partials/pagination.html'):
    return render_to_string(template, {'page_obj': page_obj})
