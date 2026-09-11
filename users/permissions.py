from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    # Only allow users with the admin role.
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

