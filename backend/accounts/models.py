from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=150, blank=True)
    province = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    university = models.CharField(max_length=150, blank=True)
    qualification = models.CharField(max_length=150, blank=True)
    certificates = models.CharField(max_length=200, blank=True)

    role = models.CharField(
        max_length=50,
        default='user'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
