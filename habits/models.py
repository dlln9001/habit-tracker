from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Habit(models.Model):
    # day associations for the "days" field
    # DAY_CHOICES = [
    #     (0, 'Sunday'),
    #     (1, 'Monday'),
    #     (2, 'Tuesday'),
    #     (3, 'Wednesday'),
    #     (4, 'Thursday'),
    #     (5, 'Friday'),
    #     (6, 'Saturday'),
    # ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    days = models.JSONField(default=list, null=True, blank=True)  # List of days (0-6) when the habit should be performed
    times_per_week = models.PositiveIntegerField(null=True, blank=True) 
    days_of_month = models.JSONField(default=list, null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)  # For time-based habits
    quantity = models.FloatField(null=True, blank=True)  # For unit-based habits
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    icon_url = models.CharField(max_length=200)

    def habit_type(self):
        if self.duration is not '':
            return 'time-based'
        elif self.quantity is not '':
            return 'unit-based'
        else:
            return 'undefined'