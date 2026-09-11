from rest_framework import serializers
from django.contrib.auth import get_user_model

# Grabs the custom User model from settings.py
User = get_user_model()

# Handles incoming registration requests: validates, then saves a new user
class RegisterSerializer(serializers.ModelSerializer):
    # Password goes in but never comes back out in a response
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'phone')
        read_only_fields = ('id',)

    # Takes the validated data and creates a new user in the DB
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'employee'),
            phone=validated_data.get('phone', ''),
        )
        return user

# Converts a user object into JSON for API responses
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone')

# Only allows admin to change a user's role, nothing else
class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('role',)

