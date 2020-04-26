from django.db import models

from ..media.fields import FileBrowseField
from .forms import TinyMceWidget


FileBrowseField = FileBrowseField


class RichTextField(models.TextField):
    """
    TextField that stores HTML.
    """

    def formfield(self, **kwargs):

        kwargs["widget"] = TinyMceWidget
        kwargs.setdefault("required", False)

        formfield = super().formfield(**kwargs)

        return formfield
