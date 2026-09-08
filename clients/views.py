from rest_framework import generics, permissions
from .models import Client
from .serializers import ClientSerializer
from .permissions import ClientPermission


class ClientList(generics.ListCreateAPIView):
    serializer_class = ClientSerializer
    permission_classes = (permissions.IsAuthenticated, ClientPermission)

    def get_queryset(self):
        user = self.request.user
        if user.role in ('manager', 'admin'):
            return Client.objects.all()
        return Client.objects.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ClientDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClientSerializer
    permission_classes = (permissions.IsAuthenticated, ClientPermission)

    def get_queryset(self):
        user = self.request.user
        if user.role in ('manager', 'admin'):
            return Client.objects.all()
        return Client.objects.filter(created_by=user)

