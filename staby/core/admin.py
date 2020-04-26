from django.contrib import admin
from django.db import models
from django.forms import DateTimeField

from .widgets import DatePickerInput, DateTimePickerInput

class StabyModelAdminMixin:
    formfield_overrides = {
        models.DateField: {"widget": DatePickerInput},
        models.DateTimeField: {"form_class": DateTimeField, "widget": DateTimePickerInput}
    }
