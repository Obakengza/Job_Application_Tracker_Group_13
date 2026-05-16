from rest_framework import serializers

from .models import JobApplication


class JobApplicationSerializer(
    serializers.ModelSerializer
):

    status = serializers.StringRelatedField()

    class Meta:
        model = JobApplication

        fields = '__all__'