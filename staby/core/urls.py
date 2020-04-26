from django.contrib import admin
from django.urls import path, include

from ..media.sites import site as media_site
from ..articles import urls as articles_urls

urlpatterns = [

    path('admin/media/', media_site.urls),
    path('admin/', admin.site.urls),

    path('articles/', include(articles_urls)),

]

