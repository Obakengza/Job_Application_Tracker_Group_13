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
    job_post = serializers.PrimaryKeyRelatedField(
    queryset=JobPost.objects.all(),
    required=False,
    allow_null=True
    )
    job_title = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    application_link = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['user']
        extra_kwargs = {
            'job_post': {'required': False, 'allow_null': True}
            }

    def get_job_title(self, obj):
        if obj.job_post:
            return obj.job_post.job_title
        return obj.manual_job_title

    def get_company_name(self, obj):
        if obj.job_post and obj.job_post.company:
            return obj.job_post.company.company_name
        return "No Company"

    def get_location(self, obj):
        if obj.job_post:
            return obj.job_post.location
        return obj.manual_location

    def get_application_link(self, obj):
        if obj.job_post:
            return obj.job_post.application_link
        return obj.manual_application_link