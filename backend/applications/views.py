from collections import defaultdict
from django.db.models import Count

from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.activity import log_activity
from .models import Application, Status
from .serializers import ApplicationSerializer, StatusSerializer


# Application API
class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Application.objects.filter(user=self.request.user)

        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status__name=status)

        work_mode = self.request.query_params.get('work_mode')
        if work_mode:
            queryset = queryset.filter(work_mode=work_mode)

        employment_type = self.request.query_params.get('employment_type')
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)

        return queryset

    def perform_create(self, serializer):
        application = serializer.save(user=self.request.user)
        job_title = (
            application.job_post.job_title
            if application.job_post_id
            else application.manual_job_title
        )
        company_name = (
            application.job_post.company.company_name
            if application.job_post_id and application.job_post.company_id
            else application.manual_company or "No Company"
        )

        if application.job_post_id:
            activity_type = "job_applied"
            description = (
                f"User {self.request.user.email} applied for "
                f"{job_title} at {company_name}"
            )
        else:
            activity_type = "manual_application_created"
            description = (
                f"User {self.request.user.email} manually tracked "
                f"{job_title} at {company_name}"
            )

        log_activity(
            email=self.request.user.email,
            activity_type=activity_type,
            activity_description=description,
            first_name=self.request.user.first_name,
            last_name=self.request.user.last_name,
            password=self.request.user.password,
            role="user",
        )

    def perform_update(self, serializer):
        application = serializer.save()
        job_title = (
            application.job_post.job_title
            if application.job_post_id
            else application.manual_job_title
        )
        log_activity(
            email=self.request.user.email,
            activity_type="application_updated",
            activity_description=(
                f"User {self.request.user.email} updated application "
                f"{job_title} to {application.status.name}"
            ),
            first_name=self.request.user.first_name,
            last_name=self.request.user.last_name,
            password=self.request.user.password,
            role="user",
        )


# Status API
class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer


# Kanban API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def kanban_view(request):
    applications = Application.objects.filter(
        user=request.user
    ).select_related('status')

    board = defaultdict(list)

    for app in applications:
        status_name = app.status.name
        serialized = ApplicationSerializer(app).data
        board[status_name].append(serialized)

    return Response(board)


# Dashboard API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    applications = Application.objects.filter(user=request.user)

    total_applications = applications.count()

    status_counts = applications.values(
        'status__name'
    ).annotate(
        total=Count('id')
    )

    dashboard_data = {
        "total_applications": total_applications
    }

    for item in status_counts:
        dashboard_data[item['status__name']] = item['total']

    return Response(dashboard_data)
