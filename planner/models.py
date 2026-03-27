'''
Models for the application.
----------------------------
    defines what a Task looks like in the database

'''

from django.db import models

class Task(models.Model):
    date         = models.DateField()
    name         = models.CharField(max_length=200)
    category     = models.CharField(max_length=100)
    start_time   = models.TimeField()
    end_time     = models.TimeField()
    is_completed = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.date} — {self.name}"
