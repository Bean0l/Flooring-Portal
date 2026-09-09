from django.db import models
from django.conf import settings


class Estimate(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('approved', 'Approved'),
    ]

    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='estimates'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='estimates'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Estimate #{self.pk} - {self.client.name}"


class EstimateLineItem(models.Model):
    estimate = models.ForeignKey(
        Estimate,
        on_delete=models.CASCADE,
        related_name='line_items'
    )
    service = models.ForeignKey(
        'services.Service',
        on_delete=models.PROTECT,
        related_name='line_items'
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.line_total = self.quantity * self.service.price_per_unit
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.service.name} - {self.quantity} {self.service.unit_of_measurement}"

