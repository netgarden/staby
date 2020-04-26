import os
import pathlib
import time
from PIL import Image
from django.conf import settings
from django.urls import reverse

THUMBNAILS_DIR = '_thumbs'


class MediaManager:

    def __init__(self, path):
        
        self.realpath = self._get_realpath(path)
        self.path = path

    def _get_realpath(self, path):

        realpath = settings.MEDIA_ROOT
        if path is not None and path != '':
            realpath = os.path.join(realpath, path)

        realpath = os.path.abspath(realpath)

        if not realpath.startswith(settings.MEDIA_ROOT):
            raise Exception('Requested media path is not inside MEDIA_ROOT')

        return realpath

    def listdir(self):

        directories, files = [], []
        for entry in os.scandir(self.realpath):
            if entry.is_dir():
                directories.append(entry)
            else:
                files.append(entry)

        return directories, files

    def upload(self, file):

        path = settings.MEDIA_ROOT
        if self.path is not None and self.path != '':
            path = os.path.join(path, self.path)

        path = os.path.join(path, file.name)

        with open(path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

    def get_path(self, entry):
        return os.path.join(self.path, entry.name)

    def get_url(self, entry):

        entry_path = ''
        if self.path is not None and self.path != '':
            entry_path = self.path

        browse_url = reverse('media:media_browse')

        if entry.name == '..':
            idx = entry_path.rfind('/')
            if idx != -1:
                entry_path = entry_path[:idx]
            else:
                return browse_url
        else:
            if entry_path is not None and entry_path != '':
                entry_path += '/'
            entry_path += entry.name

        if entry.is_dir():
            return '{}?path={}'.format(browse_url, entry_path)
        else:
            return settings.MEDIA_URL + entry_path

    def mkdir(self, name):

        if '/' in name or '\\' in name:
            raise Exception("File/Folder name cannot contain slashes!")

        dir_path = os.path.join(settings.MEDIA_ROOT, self.path, name)
        os.mkdir(dir_path)

    def delete(self, name):

        if '/' in name or '\\' in name:
            raise Exception("File/Folder name cannot contain slashes!")

        path = os.path.join(settings.MEDIA_ROOT, self.path, name)

        if os.path.isdir(path):
            import shutil
            shutil.rmtree(path)
        else:
            os.unlink(path)

    def rename(self, name, new_name):

        if '/' in name or '\\' in name or '/' in new_name or '\\' in new_name:
            raise Exception("File/Folder name cannot contain slashes!")

        path = os.path.join(settings.MEDIA_ROOT, self.path, name)
        new_path = os.path.join(settings.MEDIA_ROOT, self.path, new_name)

        os.rename(path, new_path)


class MediaListing:

    def __init__(self, request):
        self._request = request
        
        self._data = None
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        
        if self._data is None:
            self._data = self._load_data()

        try:
            
            item = self._data[self._index]
            self._index += 1

            return item

        except IndexError:
            self._index = 0
            raise StopIteration

    def _load_data(self):

        path = self._request.GET.get('path', None)
        manager = MediaManager(path)

        dirs, files = manager.listdir()

        self._sort(dirs)
        self._sort(files)

        data = []

        for d in self._filter(dirs):
            data.append(File(d, manager))

        for f in self._filter(files):
            data.append(File(f, manager))

        if path is not None and path != '':
            data.insert(0, File(ParentDirEntry(), manager))

        return data

    def _sort(self, entries):
        _sort_fn = lambda entry: entry.name
        entries.sort(key=_sort_fn, reverse=False)

    def _filter(self, entries):

        for entry in entries:

            if entry.name.startswith('.') and entry.name != '..':
                continue

            yield entry


class File:

    def __init__(self, entry_or_name, manager_or_path):

        if isinstance(entry_or_name, str):
            self.__name = entry_or_name
            self.__entry = None
        else:
            self.__name = entry_or_name.name
            self.__entry = entry_or_name

        if isinstance(manager_or_path, MediaManager):
            self._manager = manager_or_path
        else:
            self._manager = MediaManager(manager_or_path)

    def thumbnail(self, sizes):

        dot_index = self.path.rindex(".")
        name = self.path[:dot_index]

        thumbname = '{}_thumb_{}x{}.jpg'.format(name, *sizes)
        thumbdirpath = os.path.join(THUMBNAILS_DIR, '{}x{}'.format(*sizes))
        thumbpath = os.path.join(thumbdirpath, thumbname)

        thumbpath_real = os.path.join(settings.MEDIA_ROOT, thumbpath)

        exists = os.path.exists(thumbpath_real)

        if exists:

            ctime = os.path.getctime(thumbpath_real)
            now = time.time()

            ttl = int(getattr(settings, 'THUMBNAILS_TTL', 60 * 60 * 24 * 30))

            if int(now - ctime) > ttl:
                os.unlink(thumbpath_real)
                exists = False

        if not exists:
            os.makedirs(os.path.dirname(thumbpath_real), exist_ok=True)

            img = Image.open(os.path.join(settings.MEDIA_ROOT, self.path))

            if img.mode != 'RGB':
                img = img.convert('RGB')

            img.thumbnail(sizes, Image.ANTIALIAS)
            img.save(thumbpath_real, 'JPEG')  # , quality=80)

        return Thumbnail(thumbname, sizes)


    @property
    def name(self):
        return self._get_entry().name

    @property
    def url(self):
        return self._manager.get_url(self._get_entry())

    @property
    def is_file(self):
        return self._get_entry().is_file()

    @property
    def is_dir(self):
        return self._get_entry().is_dir()

    @property
    def is_symlink(self):
        return self._get_entry().is_symlink()

    @property
    def icon(self):
        if self.is_dir:
            return 'folder'
        else:
            return 'blank'

    @property
    def path(self):
        return self._manager.get_path(self._get_entry())

    def _get_entry(self):

        if self.__entry is None:
            self.__entry = pathlib.Path(os.path.join(self._manager.realpath, self.__name))

        return self.__entry

    def __len__(self):
        return len(self.path)


class ParentDirEntry:
    
    name = '..'

    def is_file(self):
        return False

    def is_dir(self):
        return True


class Thumbnail:

    def __init__(self, path, sizes):
        self.path = path
        self.sizes = sizes

    @property
    def url(self):
        url = settings.MEDIA_URL
        if url.endswith('/'):
            url = url[:-1]

        return os.path.join(url, THUMBNAILS_DIR, '{}x{}'.format(*self.sizes), self.path)
