from rest_framework import serializers
from .models import Company, JobPost


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class JobPostSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    company_display_name = serializers.CharField(source='company.company_name', read_only=True)

    class Meta:
        model = JobPost
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['company_name'] = data.pop('company_display_name', '')
        return data

    def create(self, validated_data):
        company_name = validated_data.pop('company_name', '').strip()
        if company_name:
            company, created = Company.objects.get_or_create(company_name=company_name)
            validated_data['company'] = company
        return super().create(validated_data)

    def update(self, instance, validated_data):
        company_name = validated_data.pop('company_name', '').strip()
        if company_name:
            company, created = Company.objects.get_or_create(company_name=company_name)
            validated_data['company'] = company
        return super().update(instance, validated_data)
