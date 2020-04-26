import os
from django.db.models import CharField
from django import forms
from django.forms import widgets
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _


from .manager import File

class FileBrowseWidget(widgets.Input):
    input_type = 'text'

    class Media:
        js = ('staby/js/media.js',)

    def __init__(self, attrs={}):
        super().__init__(attrs)
        self.directory = attrs.get('directory', '')
        if attrs is not None:
            self.attrs = attrs.copy()
        else:
            self.attrs = {}
        super().__init__(attrs)

    def render(self, name, value, attrs=None, renderer=None):
        url = reverse("media:media_browse")
        if value is None:
            value = ""
        #if value != "" and not isinstance(value, File):
        #    value = File(value, self.directory)
        final_attrs = self.build_attrs(attrs, extra_attrs={"type": self.input_type, "name": name})
        final_attrs['url'] = url
        final_attrs['directory'] = self.directory
        final_attrs['data_attrs'] = {k: v for k, v in final_attrs.items() if k.startswith('data-')}
        if value != "":
            try:
                final_attrs['directory'] = os.path.split(value.original.path_relative_directory)[0]
            except:
                pass
        return render_to_string("staby/media/custom_field.html", locals())


class FileBrowseFormField(forms.CharField):

    default_error_messages = {
        'extension': _(u'Extension %(ext)s is not allowed. Only %(allowed)s is allowed.'),
    }

    def __init__(self, max_length=None, min_length=None, site=None, directory=None, extensions=None, format=None, *args, **kwargs):
        self.max_length, self.min_length = max_length, min_length
        self.directory = directory
        super().__init__(*args, **kwargs)

    def clean(self, value):
        value = super().clean(value)
        if value in self.empty_values:
            return self.empty_value
        return value


class FileBrowseField(CharField):
    description = "FileBrowseField"

    def __init__(self, *args, **kwargs):
        self.directory = kwargs.get('directory', '')
        super().__init__(*args, **kwargs)

    #def to_python(self, value):
    #    if not value or isinstance(value, File):
    #        return value
    #    return File(value, self.directory)

    #def from_db_value(self, value, expression, connection, context):
    #    return self.to_python(value)

    #def get_prep_value(self, value):
    #    if not value:
    #        return value
    #    return value.path

    #def value_to_string(self, obj):
    #    value = self.value_from_object(obj)
    #    if not value:
    #        return value
    #    if type(value) is str:
    #        return value
    #    return value.path

    def formfield(self, **kwargs):
        
        attrs = {
            "directory": self.directory
        }

        defaults = {
            'form_class': FileBrowseFormField,
            'widget': FileBrowseWidget(attrs=attrs),
            'directory': self.directory,
        }

        return super().formfield(**defaults)
