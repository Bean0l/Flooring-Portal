from django.db import models


class Service(models.Model):
    UNIT_CHOICES = [
        ('sqft', 'Square Feet'),
        ('linft', 'Linear Feet'),
        ('unit', 'Per Unit'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    unit_of_measurement = models.CharField(max_length=10, choices=UNIT_CHOICES)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


