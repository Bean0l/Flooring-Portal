from rest_framework.permissions import BasePermission


class IsManagerOrAdmin(BasePermission):
    """
    Allow full access to managers and admin.
    Read-only access for everyone else.
    """
    def has_permission(self, request, view):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return request.user.role in ('manager', 'admin')