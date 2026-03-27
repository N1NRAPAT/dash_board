'''
Serializers for the application.
--------------------------------
    converts Task objects → JSON (so React can read it)

'''

from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'