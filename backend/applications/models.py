from django.db import models
from django.contrib.auth.models import User
from jobs.models import JobPost

class Status(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_post = models.ForeignKey(
    JobPost,
    on_delete=models.CASCADE,
    null=True,
    blank=True
    )
    manual_job_title = models.CharField(max_length=100, null=True, blank=True)
    manual_company = models.CharField(max_length=100, null=True, blank=True)
    manual_location = models.CharField(max_length=100, null=True, blank=True)
    manual_application_link = models.URLField(null=True, blank=True)

    application_date = models.DateField()
    interview_date = models.DateField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)

    employment_type = models.CharField(max_length=50)
    work_mode = models.CharField(max_length=50, default="Not specified")
    status = models.ForeignKey(Status, on_delete=models.CASCADE)
   

    application_date = models.DateField()
    interview_date = models.DateField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    employment_type = models.CharField(max_length=50)
    work_mode = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return f"{self.user.username} - {self.job_post}"

    class Meta:
        unique_together = ('user', 'job_post') 