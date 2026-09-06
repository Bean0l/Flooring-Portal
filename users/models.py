from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

# User DB table
class User(AbstractUser):
    # Types of roles a user can have
    ROLES_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    )

    # Creates a role column in the DB table
    role = models.CharField(max_length=20, choices=ROLES_CHOICES, default='employee')
    # Creates a phone-number column in the DB table
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
    