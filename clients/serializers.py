from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Client
        fields = ('id', 'name', 'phone', 'email', 'address', 'created_by', 'created_at')
        read_only_fields = ('id', 'created_by', 'created_at')

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Client name is required.")
        return value

    def validate_email(self, value):
        if value and '@' not in value:
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_phone(self, value):
        import re
        if value and not re.match(r'^\d{10}$', re.sub(r'\D', '', value)):
            raise serializers.ValidationError("Phone must be 10 digits.")
        return value