from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Habit(models.Model):
    INTERVAL_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    DAY_CHOICES = [
        (0, 'Sunday'),
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    repeat_interval = models.CharField(max_length=10, choices=INTERVAL_CHOICES)
    repeat_frequency = models.PositiveIntegerField()  # How many times per interval
    days = models.JSONField(default=list)  # List of days (0-6) when the habit should be performed
    time = models.TimeField()
    location = models.CharField(max_length=200)
    duration = models.DurationField(null=True, blank=True)  # For time-based habits
    quantity = models.FloatField(null=True, blank=True)  # For unit-based habits
    unit = models.CharField(max_length=50, null=True, blank=True)  # e.g., 'pages', 'miles', etc.
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def habit_type(self):
        if self.duration is not None:
            return 'time-based'
        elif self.quantity is not None:
            return 'unit-based'
        else:
            return 'undefined'