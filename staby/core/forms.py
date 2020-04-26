from django import forms
from django.contrib.admin.templatetags.admin_static import static


class TinyMceWidget(forms.Textarea):
    """
    Setup the JS files and targeting CSS class for a textarea to
    use TinyMCE.
    """

    class Media:
        js = [
            static('staby/admin/js/media.js'),
            static('staby/js/tinymce/tinymce.min.js'),
            static('staby/js/tiny_mce.setup.js'),
        ]
        # css = {'all': [static("/tinymce/tinymce.css")]}

    def __init__(self, *args, **kwargs):
        super(TinyMceWidget, self).__init__(*args, **kwargs)
        self.attrs["class"] = "mceEditor"