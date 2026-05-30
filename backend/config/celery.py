import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('vohnik')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.task_routes = {
    'notifications.tasks.send_group_email': {'queue': 'email_queue'},
    'notifications.tasks.generate_fandom_stats': {'queue': 'operations_queue'},
    'notifications.tasks.cleanup_rejected_requests': {'queue': 'operations_queue'},
}
