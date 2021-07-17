import os
import random
from django.conf import settings

from staby.media.manager import File
from staby.widgets import Widget


class RandomImageWidget(Widget):

    def __init__(self, title, basedir):
        super().__init__()
        self.title = title
        self.basedir = basedir

    def get_title(self):
        return self.title

    def get_data(self):

        root = settings.MEDIA_ROOT
        if self.basedir is not None and self.basedir != "":
            root = os.path.join(root, self.basedir)

        entry = self._get_random_image(root)

        if entry is None:
            return {'image': None}

        media_root = os.path.realpath(settings.MEDIA_ROOT)

        dirpath = os.path.dirname(entry.path)
        dirname = dirpath[len(media_root):]
        if dirname.startswith(os.path.sep):
            dirname = dirname[1:]

        return {'image': File(entry, dirname)}

    def get_template(self):
        return 'widgets/galleries_random_image.html'

    def _get_random_image(self, root):

        allowed_extensions = ['jpg', 'jpeg', 'bmp', 'png', 'gif']

        entries = [x for x in os.scandir(root)]
        if len(entries) == 0:
            return None

        entry = None
        while entry is None:

            index = random.randint(0, len(entries) - 1)
            entry = entries[index]

            if entry.is_dir():
                entry = self._get_random_image(entry.path)

            if not any(entry.name.lower().endswith(ext) for ext in allowed_extensions):
                entry = None

            if entry is None:
                del entries[index]
                if len(entries) == 0:
                    return None


        if entry is None:
            return None

        return entry
