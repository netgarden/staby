from django.conf.urls import url
from django.contrib.admin import AdminSite

from . import views

class StabyAdminMediaSite(AdminSite):

    def get_urls(self):
        urlpatterns = [
            url(r'^$', self.admin_view(views.browse), name='media_browse'),
            url(r'^upload/$', self.admin_view(views.upload), name='media_upload'),
            url(r'^folder/create/$', self.admin_view(views.createFolder), name='media_folder_create'),
            url(r'^delete/$', self.admin_view(views.delete), name='media_delete'),
            url(r'^rename/$', self.admin_view(views.rename), name='media_rename'),
            #url(r'^browse/$', path_exists(self, filebrowser_view(self.browse)), name="fb_browse"),
            #url(r'^createdir/', path_exists(self, filebrowser_view(self.createdir)), name="fb_createdir"),
            #url(r'^upload/', path_exists(self, filebrowser_view(self.upload)), name="fb_upload"),
            #url(r'^delete_confirm/$', file_exists(self, path_exists(self, filebrowser_view(self.delete_confirm))), name="fb_delete_confirm"),
            #url(r'^delete/$', file_exists(self, path_exists(self, filebrowser_view(self.delete))), name="fb_delete"),
            #url(r'^detail/$', file_exists(self, path_exists(self, filebrowser_view(self.detail))), name="fb_detail"),
            #url(r'^version/$', file_exists(self, path_exists(self, filebrowser_view(self.version))), name="fb_version"),
            #url(r'^upload_file/$', staff_member_required(csrf_exempt(self._upload_file)), name="fb_do_upload"),
        ]
        return urlpatterns

    @property
    def urls(self):
        "filebrowser.site URLs"
        return self.get_urls(), self.name, self.name

site = StabyAdminMediaSite(name='media')