from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.

# Controls how do the User model appears in the admin panel
class CustomUserAdmin(UserAdmin):
    # Controls how we view all users in a table
    list_display = ('username', 'email', 'role', 'is_staff')
    # Controls the detail view of a specific user when click to edit, also added another section called Role Info
    fieldsets = UserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role', 'phone')}),
        )

admin.site.register(User, CustomUserAdmin)