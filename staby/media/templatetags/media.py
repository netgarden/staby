import os.path
from django import template
from django.conf import settings

from ..manager import File

register = template.Library()


@register.filter
def thumbnail(value, thumb_type):
    """Returns thumbnail for image"""

    if not isinstance(value, File):
        parts = os.path.split(value)

        value = File(parts[1], parts[0])

    thumb_settings = getattr(settings, "THUMBNAILS")

    thumb = value.thumbnail(thumb_settings[thumb_type])

    return thumb.url
