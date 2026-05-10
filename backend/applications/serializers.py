from rest_framework import serializers

from .models import Application, Status
from jobs.models import JobPost


# Status Serializer
class StatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Status
        fields = '__all__'


# Job Post Serializer
class JobPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobPost
        fields = '__all__'


# Application Serializer
class ApplicationSerializer(serializers.ModelSerializer):
    status_name = serializers.CharField(source='status.name', read_only=True)
    job_title = serializers.CharField(source='job_post.job_title', read_only=True)
    company_name = serializers.CharField(source='job_post.company.company_name', read_only=True)
    location = serializers.CharField(source='job_post.location', read_only=True)
    application_link = serializers.CharField(source='job_post.application_link', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['user']
