from django.db import models


class Company(models.Model):
    company_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    website = models.URLField(blank=True)

    def __str__(self):
        return self.company_name


class ApplicationStatus(models.Model):
    status_name = models.CharField(max_length=50)

    def __str__(self):
        return self.status_name


class JobPost(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    job_description = models.TextField()
    industry = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    post_date = models.DateField()
    deadline_date = models.DateField()

    def __str__(self):
        return self.job_title


class JobApplication(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    job_post = models.ForeignKey(JobPost, on_delete=models.CASCADE)
    status = models.ForeignKey(ApplicationStatus, on_delete=models.CASCADE)

    application_date = models.DateField()

    employment_type = models.CharField(max_length=50)

    work_mode = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.job_post.job_title}"


class Interview(models.Model):
    application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE
    )

    interview_date = models.DateField()

    note = models.TextField()

    def __str__(self):
        return f"Interview {self.id}"


class Reminder(models.Model):
    application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE
    )

    reminder_date = models.DateField()

    message = models.TextField()

    def __str__(self):
        return f"Reminder {self.id}"