from django.db import models


class Company(models.Model):
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.company_name


class JobPost(models.Model):

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    job_title = models.CharField(max_length=255)

    job_description = models.TextField(
        null=True,
        blank=True
    )

    location = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    experience = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    department = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    application_link = models.URLField(
        null=True,
        blank=True
    )

    employment_type = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    work_mode = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    post_date = models.DateField(
        null=True,
        blank=True
    )

    deadline_date = models.DateField(
        null=True,
        blank=True
    )

    def __str__(self):
        return self.job_title
