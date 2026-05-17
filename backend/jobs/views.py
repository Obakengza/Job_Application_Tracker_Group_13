from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
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
