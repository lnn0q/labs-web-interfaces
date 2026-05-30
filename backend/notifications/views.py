from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AsyncTaskResult
from .serializers import AsyncTaskResultSerializer
from .tasks import send_group_email, generate_fandom_stats, cleanup_rejected_requests

class SendEmailView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request):
        subject = request.data.get('subject')
        message = request.data.get('message')
        fandom_id = request.data.get('fandom_id')
        send_group_email.delay(subject, message, fandom_id)
        return Response({"status": "task_started"}, status=status.HTTP_200_OK)

class RunTaskView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request):
        task_type = request.data.get('task_type')
        if task_type == 'stats':
            generate_fandom_stats.delay()
        elif task_type == 'cleanup':
            cleanup_rejected_requests.delay()
        return Response({"status": "task_started"}, status=status.HTTP_200_OK)

class TaskResultListView(generics.ListAPIView):
    queryset = AsyncTaskResult.objects.all()
    serializer_class = AsyncTaskResultSerializer
    permission_classes = (permissions.IsAdminUser,)
