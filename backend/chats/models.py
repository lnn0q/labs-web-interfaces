from django.db import models
from django.conf import settings
from fandoms.models import Fandom

class ChatRoom(models.Model):
    fandom = models.ForeignKey(Fandom, on_delete=models.CASCADE, related_name='chat_rooms')
    name = models.CharField(max_length=255)
    room_type = models.CharField(max_length=20, choices=(('general', 'Загальний'), ('topic', 'Тематичний')), default='topic')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fandom.name} - {self.name}"

    class Meta:
        verbose_name = 'Чат-кімната'
        verbose_name_plural = 'Чат-кімнати'

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='messages')
    text = models.TextField()
    image = models.ImageField(upload_to='chat_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_edited = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Повідомлення'
        verbose_name_plural = 'Повідомлення'

    def __str__(self):
        return f"{self.author.name}: {self.text[:20]}"
