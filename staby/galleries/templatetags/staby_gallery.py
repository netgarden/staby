from django import template
from django.conf import settings

from ...media.manager import File

register = template.Library()


@register.filter
def thumbnail_url(value, thumb_type):
    """Returns thumbnail for galleries image"""

    if not isinstance(value, File):
        value = File(value)

    thumb_settings = getattr(settings, "THUMBNAILS")

    return value.thumbnail(thumb_settings[thumb_type]).url()