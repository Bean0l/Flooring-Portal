from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import Register, Profile, UserList, UserDetail

urlpatterns = [
    # POST - send username & password, get back a token
    path('login/', TokenObtainPairView.as_view(), name='login'),

    # POST - send a refresh token, get back a new access token
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # POST - send user info, create a new account
    path('register/', Register.as_view(), name='register'),

    # GET - send a token, get back your own user info
    path('me/', Profile.as_view(), name='me'),

    # GET - list all users (admin only)
    path('', UserList.as_view(), name='user-list'),

    # GET/PATCH/DELETE - manage a specific user (admin only)
    path('<int:pk>/', UserDetail.as_view(), name='user-detail'),
]

