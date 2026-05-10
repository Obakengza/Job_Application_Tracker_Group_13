from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, JobPostViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'job-posts', JobPostViewSet)

urlpatterns = [
    path('', include(router.urls)),
]