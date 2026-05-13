from django.contrib import admin

from .models import (
    Company,
    ApplicationStatus,
    JobPost,
    JobApplication,
    Interview,
    Reminder
)


admin.site.register(Company)
admin.site.register(ApplicationStatus)
admin.site.register(JobPost)
admin.site.register(JobApplication)
admin.site.register(Interview)
admin.site.register(Reminder)