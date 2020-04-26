#!/usr/bin/env python3

import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name='staby',
    version='0.1.0',
    description='Django based CMS',
    long_description=long_description,
    long_description_content_type="text/markdown",
    author='Qilx',
    author_email='qilx@netgarden.org',
    url='https://github.com/netgarden/staby',
    packages=[
        'staby',
        'staby.admin',
        'staby.articles',
        'staby.blog',
        'staby.core',
        'staby.galleries',
        'staby.media',
        'staby.pages',
        'staby.utils',
    ],
    install_requires=[
        'Django<3.0',
        'django-debug-toolbar==2.2',
        'django-mptt==0.11.0',
        'Pillow==7.0.0',
        'pkg-resources==0.0.0',
        'pytz==2019.3',
        'sqlparse==0.3.0',
        'django-polymorphic',
        'django-polymorphic-tree',
        'django-admin-sortable2'
    ],
)

