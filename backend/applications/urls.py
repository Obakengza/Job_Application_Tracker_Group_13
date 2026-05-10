from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, StatusViewSet
from .views import kanban_view
from .views import dashboard_view
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'statuses', StatusViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path('tracking/kanban/', kanban_view),
    path('dashboard/', dashboard_view),
    path('login/', obtain_auth_token),
]
