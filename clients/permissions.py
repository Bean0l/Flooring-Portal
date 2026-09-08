from rest_framework.permissions import BasePermission


class ClientPermission(BasePermission):
    """
    - Create: any authenticated user
    - Read: controlled by the view's queryset (not here)
    - Update: owner, manager, or admin
    - Delete: manager or admin only
    """
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True

        if request.method == 'DELETE':
            return request.user.role in ('manager', 'admin')

        if request.method in ('PUT', 'PATCH'):
            if request.user.role in ('manager', 'admin'):
                return True
            return obj.created_by == request.user

        return False

