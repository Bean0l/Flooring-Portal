from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'name', 'description', 'unit_of_measurement', 'price_per_unit', 'created_at')
        read_only_fields = ('id', 'created_at')

