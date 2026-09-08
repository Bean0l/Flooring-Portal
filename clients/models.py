from django.db import models
from django.conf import settings


class Client(models.Model):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    address = models.TextField(blank=True, default='')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='clients'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

