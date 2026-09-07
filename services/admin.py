from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit_of_measurement', 'price_per_unit', 'created_at')
    list_filter = ('unit_of_measurement',)
    search_fields = ('name',)

