# Generated by Django 5.0.6 on 2024-07-11 05:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Habit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('repeat_interval', models.CharField(choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'), ('yearly', 'Yearly')], max_length=10)),
                ('repeat_frequency', models.PositiveIntegerField()),
                ('days', models.JSONField(default=list)),
                ('time', models.TimeField()),
                ('location', models.CharField(max_length=200)),
                ('duration', models.DurationField(blank=True, null=True)),
                ('quantity', models.FloatField(blank=True, null=True)),
                ('unit', models.CharField(blank=True, max_length=50, null=True)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
