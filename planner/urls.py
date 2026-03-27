
'''
URLs for the application.
----------------------------
    Which URL triggers which view (function that handles the request and returns a response)
'''


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]