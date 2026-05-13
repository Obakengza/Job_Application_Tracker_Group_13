from django.contrib import admin
from django.urls import path

from tracker.views import (
dashboard_summary,
application_list

)

urlpatterns = [
    path('admin/', admin.site.urls),

    path(
        'api/dashboard/',
        dashboard_summary
    ),

    path(
        'api/applications/',
        application_list
    ),
]