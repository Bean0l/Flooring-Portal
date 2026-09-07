from rest_framework import generics, permissions
from .models import Service
from .serializers import ServiceSerializer
from .permissions import IsManagerOrAdmin


# GET /api/services/ - list all services
# POST /api/services/ - create a new service (manager/admin only)
class ServiceList(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = (permissions.IsAuthenticated, IsManagerOrAdmin)


# GET /api/services/<id>/ - get one service
# PUT /api/services/<id>/ - update a service (manager/admin only)
# DELETE /api/services/<id>/ - delete a service (manager/admin only)
class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = (permissions.IsAuthenticated, IsManagerOrAdmin)