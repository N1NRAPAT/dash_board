'''
Views for the application.
----------------------------
    defines how the backend should respond to API requests
'''


from rest_framework import viewsets
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        date = self.request.query_params.get('date')
        if date:
            return Task.objects.filter(date=date).order_by('start_time')
        return Task.objects.all().order_by('date', 'start_time')