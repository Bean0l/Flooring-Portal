from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Client
        fields = ('id', 'name', 'phone', 'email', 'address', 'created_by', 'created_at')
        read_only_fields = ('id', 'created_by', 'created_at')

