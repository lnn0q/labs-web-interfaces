from django.db import models

class AsyncTaskResult(models.Model):
    STATUS_CHOICES = (
        ('pending', 'В процесі'),
        ('success', 'Успішно'),
        ('failure', 'Помилка'),
    )
    task_name = models.CharField(max_length=255)
    task_data = models.TextField()
    result = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-id']
        verbose_name = 'Результат асинхронного завдання'
        verbose_name_plural = 'Результати асинхронних завдань'
