from django.urls import path
from .views import SendEmailView, RunTaskView, TaskResultListView

urlpatterns = [
    path('send-email/', SendEmailView.as_view(), name='send_email'),
    path('run-task/', RunTaskView.as_view(), name='run_task'),
    path('task-results/', TaskResultListView.as_view(), name='task_results'),
]
