from django.contrib.admin.apps import AdminConfig


class StabyAdminConfig(AdminConfig):
    default_site = 'staby.admin.lazy_admin.LazyAdminSite'