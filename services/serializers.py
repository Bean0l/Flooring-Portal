from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'name', 'description', 'unit_of_measurement', 'price_per_unit', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Service name is required.")
        return value

    def validate_price_per_unit(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value