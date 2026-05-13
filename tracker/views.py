from django.http import JsonResponse
from django.db.models import Count
from django.utils import timezone

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    JobApplication,
    Interview,
    Reminder
)

from .serializers import (
    JobApplicationSerializer
)


def dashboard_summary(request):

    today = timezone.now().date()

    status_counts = list(
        JobApplication.objects
        .values('status__status_name')
        .annotate(total=Count('id'))
    )

    upcoming_interviews = (
        Interview.objects.filter(
            interview_date__gte=today
        ).count()
    )

    upcoming_reminders = (
        Reminder.objects.filter(
            reminder_date__gte=today
        ).count()
    )

    data = {
        "total_applications":
            JobApplication.objects.count(),

        "total_interviews":
            Interview.objects.count(),

        "total_reminders":
            Reminder.objects.count(),

        "upcoming_interviews":
            upcoming_interviews,

        "upcoming_reminders":
            upcoming_reminders,

        "status_breakdown":
            status_counts
    }

    return JsonResponse(data)


@api_view(['GET', 'POST'])
def application_list(request):

    if request.method == 'GET':

        status = request.GET.get(
            'status'
        )

        search = request.GET.get(
            'search'
        )

        sort = request.GET.get(
            'sort'
        )

        applications = (
            JobApplication.objects.all()
        )

        if status:

            applications = (
                applications.filter(
                    status__status_name=status
                )
            )

        if search:

            applications = (
                applications.filter(
                    job_post__job_title__icontains=search
                )
            )

        if sort:

            applications = (
                applications.order_by(
                    sort
                )
            )

        serializer = (
            JobApplicationSerializer(
                applications,
                many=True
            )
        )

        return Response(
            serializer.data
        )


    if request.method == 'POST':

        serializer = (
            JobApplicationSerializer(
                data=request.data
            )
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )