import json
import time
from celery import shared_task
from django.utils import timezone
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from .models import AsyncTaskResult
from accounts.models import User
from fandoms.models import Fandom, FandomRequest

def notify_admin(task_record):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "admin_tasks",
        {
            "type": "task_update",
            "task": {
                "id": task_record.id,
                "task_name": task_record.task_name,
                "task_data": task_record.task_data,
                "result": task_record.result,
                "status": task_record.status,
                "completed_at": task_record.completed_at.isoformat() if task_record.completed_at else None
            }
        }
    )

@shared_task
def send_group_email(subject, message, fandom_id):
    task_record = AsyncTaskResult.objects.create(
        task_name="Розсилка Email",
        task_data=f"Тема: {subject}, Фандом ID: {fandom_id}"
    )
    notify_admin(task_record)
    
    try:
        fandom = Fandom.objects.get(id=fandom_id)
        users = User.objects.filter(fandom_memberships__fandom=fandom)
        emails = list(users.values_list('email', flat=True))
        
        send_mail(
            subject,
            message,
            'noreply@takibi.ua',
            emails,
            fail_silently=False,
        )
        
        task_record.status = 'success'
        task_record.result = f"Відправлено {len(emails)} листів"
    except Exception as e:
        task_record.status = 'failure'
        task_record.result = str(e)
    
    task_record.completed_at = timezone.now()
    task_record.save()
    notify_admin(task_record)

@shared_task
def generate_fandom_stats():
    task_record = AsyncTaskResult.objects.create(
        task_name="Генерація статистики",
        task_data="Збір даних по всім фандомам"
    )
    notify_admin(task_record)
    
    try:
        time.sleep(5)
        fandoms_count = Fandom.objects.count()
        users_count = User.objects.count()
        
        task_record.status = 'success'
        task_record.result = f"Фандомів: {fandoms_count}, Користувачів: {users_count}"
    except Exception as e:
        task_record.status = 'failure'
        task_record.result = str(e)
        
    task_record.completed_at = timezone.now()
    task_record.save()
    notify_admin(task_record)

@shared_task
def cleanup_rejected_requests():
    task_record = AsyncTaskResult.objects.create(
        task_name="Очищення відхилених запитів",
        task_data="Видалення всіх запитів на створення фандомів зі статусом 'Відхилено'"
    )
    notify_admin(task_record)
    
    try:
        rejected_requests = FandomRequest.objects.filter(status='rejected')
        count = rejected_requests.count()
        
        time.sleep(2)
        rejected_requests.delete()
        
        task_record.status = 'success'
        task_record.result = f"Видалено {count} відхилених запитів"
    except Exception as e:
        task_record.status = 'failure'
        task_record.result = str(e)
        
    task_record.completed_at = timezone.now()
    task_record.save()
    notify_admin(task_record)
