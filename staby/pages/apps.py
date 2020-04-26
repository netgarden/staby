from django.apps import AppConfig
import django.db.models.options as options

options.DEFAULT_NAMES = options.DEFAULT_NAMES + ('staby_urls',)


class StabyPagesConfig(AppConfig):
    name = 'staby.pages'
