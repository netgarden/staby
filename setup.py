#!/usr/bin/env python3

import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name='staby',
    version='0.1.1',
    description='Django based CMS',
    long_description=long_description,
    long_description_content_type="text/markdown",
    author='Qilx',
    author_email='qilx@netgarden.org',
    url='https://github.com/netgarden/staby',
    packages=setuptools.find_packages(),
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django :: 2.2',
        'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content :: Content Management System'
    ],
    install_requires=[
        'Django==2.2.12',
        'django-admin-sortable2==0.7.6',
        'django-debug-toolbar==2.2',
        'django-js-asset==1.2.2',
        'django-mptt==0.11.0',
        'django-polymorphic==2.1.2',
        'django-polymorphic-tree==1.5.1',
        'django-tag-parser==3.2',
        'future==0.18.2',
        'pytz==2020.1',
        'sqlparse==0.3.1'
    ],
    python_requires='>=3.6',
)

