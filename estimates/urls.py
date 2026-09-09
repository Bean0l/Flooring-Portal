from django.urls import path
from .views import EstimateList, EstimateDetail, LineItemList, LineItemDetail

urlpatterns = [
    path('', EstimateList.as_view(), name='estimate-list'),
    path('<int:pk>/', EstimateDetail.as_view(), name='estimate-detail'),
    path('<int:estimate_pk>/line-items/', LineItemList.as_view(), name='line-item-list'),
    path('<int:estimate_pk>/line-items/<int:pk>/', LineItemDetail.as_view(), name='line-item-detail'),
]

