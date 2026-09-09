from rest_framework import serializers
from .models import Estimate, EstimateLineItem


class EstimateLineItemSerializer(serializers.ModelSerializer):
    service_name = serializers.ReadOnlyField(source='service.name')
    unit_of_measurement = serializers.ReadOnlyField(source='service.unit_of_measurement')
    price_per_unit = serializers.ReadOnlyField(source='service.price_per_unit')

    class Meta:
        model = EstimateLineItem
        fields = (
            'id',
            'service',
            'service_name',
            'unit_of_measurement',
            'price_per_unit',
            'quantity',
            'line_total',
        )
        read_only_fields = ('id', 'line_total')

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        return value


class EstimateSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    client_name = serializers.ReadOnlyField(source='client.name')
    line_items = EstimateLineItemSerializer(many=True, read_only=True)
    estimate_total = serializers.SerializerMethodField()

    class Meta:
        model = Estimate
        fields = (
            'id',
            'client',
            'client_name',
            'created_by',
            'status',
            'line_items',
            'estimate_total',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def get_estimate_total(self, obj):
        return sum(item.line_total for item in obj.line_items.all())

