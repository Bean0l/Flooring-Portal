from django.contrib import admin
from .models import Estimate, EstimateLineItem


class EstimateLineItemInline(admin.TabularInline):
    model = EstimateLineItem
    extra = 0
    readonly_fields = ('line_total',)


@admin.register(Estimate)
class EstimateAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'created_by', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('client__name',)
    inlines = [EstimateLineItemInline]


@admin.register(EstimateLineItem)
class EstimateLineItemAdmin(admin.ModelAdmin):
    list_display = ('estimate', 'service', 'quantity', 'line_total')
    readonly_fields = ('line_total',)

