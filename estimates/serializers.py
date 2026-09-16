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

    def validate_service(self, value):
        if not value:
            raise serializers.ValidationError("Service is required.")
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

    def validate_client(self, value):
        if not value:
            raise serializers.ValidationError("Client is required.")
        return value

    def validate_status(self, value):
        allowed = [choice[0] for choice in Estimate.STATUS_CHOICES]
        if value not in allowed:
            raise serializers.ValidationError(f"Status must be one of: {', '.join(allowed)}.")
        return value

    def get_estimate_total(self, obj):
        return sum(item.line_total for item in obj.line_items.all())