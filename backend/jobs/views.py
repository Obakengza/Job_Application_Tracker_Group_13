from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from accounts.activity import log_activity
from .models import Company, JobPost
from .serializers import CompanySerializer, JobPostSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]


class JobPostViewSet(viewsets.ModelViewSet):
    queryset = JobPost.objects.select_related('company').all()
    serializer_class = JobPostSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        job_post = serializer.save()
        log_activity(
            email="admin@gmail.com",
            activity_type="job_post_created",
            activity_description=f"Admin created job post: {job_post.job_title}",
            first_name="System",
            last_name="Admin",
            password="cmpgadmin",
            role="admin",
        )

    def perform_update(self, serializer):
        job_post = serializer.save()
        log_activity(
            email="admin@gmail.com",
            activity_type="job_post_updated",
            activity_description=f"Admin updated job post: {job_post.job_title}",
            first_name="System",
            last_name="Admin",
            password="cmpgadmin",
            role="admin",
        )
