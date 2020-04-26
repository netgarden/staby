import copy
from django.contrib.admin.sites import (AdminSite, site as default_site, NotRegistered, AlreadyRegistered)


class LazyAdminSite(AdminSite):

    site_title = 'Staby'
    site_header = 'Staby administration'

    apps_ordering = [
        'auth',
        'pages',
        'media'
    ]

    def get_app_list(self, request):

        app_list = super().get_app_list(request)

        app_list.append({
            'name': 'Media library',
            'app_label': 'media',
            'app_url': '/admin/media/',
            'has_module_perms': True,
            'models': [],
        })

        local_apps_ordering = copy.copy(self.__class__.apps_ordering)

        app_list.sort(key=lambda x: self.__class__.app_list_comparator(x, local_apps_ordering))

        return app_list

    @classmethod
    def app_list_comparator(cls, item, ordering):

        app_label = item['app_label']

        if app_label in cls.apps_ordering:
            return cls.apps_ordering.index(app_label)

        index = len(ordering)
        ordering.append(app_label)

        return index

    def get_urls(self):
        urls = super().get_urls()

        ## Filebrowser admin media library.
        #if 'filebrowser' in settings.INSTALLED_APPS:
        #
        #    urls += [
        #        re_path("^filebrowser/$", lambda r: redirect("filebrowser:fb_browse"), name="media-library"),
        #        #path('media', include('staby.admin.media.urls'))
        #    ]

        # from staby.admin.media.sites import site
        # urls += [path('media/', site.urls)]

        return urls
