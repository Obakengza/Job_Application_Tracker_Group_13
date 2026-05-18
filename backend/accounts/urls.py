from django.urls import path
from .views import RegisterView, CurrentUserView, LogoutView, PlainSQLLoginView, AdminLoginView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),

    path('login/', PlainSQLLoginView.as_view(), name='login'),

    path('admin-login/', AdminLoginView.as_view(), name='admin_login'),

    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('user/', CurrentUserView.as_view(), name='current_user'),

    path('logout/', LogoutView.as_view(), name='logout'),
]
