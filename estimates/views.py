from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from .models import Estimate, EstimateLineItem
from .serializers import EstimateSerializer, EstimateLineItemSerializer
from .permissions import EstimatePermission, LineItemPermission


class EstimateList(generics.ListCreateAPIView):
    serializer_class = EstimateSerializer
    permission_classes = (permissions.IsAuthenticated, EstimatePermission)

    def get_queryset(self):
        user = self.request.user
        if user.role in ('manager', 'admin'):
            return Estimate.objects.all()
        return Estimate.objects.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class EstimateDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EstimateSerializer
    permission_classes = (permissions.IsAuthenticated, EstimatePermission)

    def get_queryset(self):
        user = self.request.user
        if user.role in ('manager', 'admin'):
            return Estimate.objects.all()
        return Estimate.objects.filter(created_by=user)


class LineItemList(generics.ListCreateAPIView):
    serializer_class = EstimateLineItemSerializer
    permission_classes = (permissions.IsAuthenticated, LineItemPermission)

    def get_estimate(self):
        user = self.request.user
        if user.role in ('manager', 'admin'):
            queryset = Estimate.objects.all()
        else:
            queryset = Estimate.objects.filter(created_by=user)

        try:
            return queryset.get(pk=self.kwargs['estimate_pk'])
        except Estimate.DoesNotExist:
            raise NotFound("Estimate not found.")

    def get_queryset(self):
        estimate = self.get_estimate()
        return EstimateLineItem.objects.filter(estimate=estimate)

    def perform_create(self, serializer):
        estimate = self.get_estimate()
        serializer.save(estimate=estimate)


class LineItemDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EstimateLineItemSerializer
    permission_classes = (permissions.IsAuthenticated, LineItemPermission)

    def get_estimate(self):
        user = self.request.user
        if user.role in ('manager', 'admin'):
            queryset = Estimate.objects.all()
        else:
            queryset = Estimate.objects.filter(created_by=user)

        try:
            return queryset.get(pk=self.kwargs['estimate_pk'])
        except Estimate.DoesNotExist:
            raise NotFound("Estimate not found.")

    def get_queryset(self):
        estimate = self.get_estimate()
        return EstimateLineItem.objects.filter(estimate=estimate)

