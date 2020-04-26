from django.conf import settings as django_settings


def settings(request):
    return {
        'SITE_TITLE': django_settings.SITE_TITLE,
        'SITE_PAYOFF': django_settings.SITE_PAYOFF
    }
