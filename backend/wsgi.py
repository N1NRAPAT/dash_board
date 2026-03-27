"""
WSGI config for backend project.
----------------------------------

    This module contains the WSGI application used for deploying the project.

"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()
