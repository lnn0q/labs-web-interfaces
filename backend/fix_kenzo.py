import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from chats.models import Message, ChatRoom
from accounts.models import User
import datetime
from django.utils import timezone

try:
    kenzo = User.objects.get(email="kenzo@vohnik.ua")
    
    # Delete all existing Kenzo messages
    Message.objects.filter(author=kenzo).delete()
    print("Deleted old messages.")
    
    rooms = ChatRoom.objects.all()
    text = (
        "Привіт усім! Я Кензо, маскот Takibi - цього затишного Вогнища. ✨\n\n"
        "Давайте поважати один одного: будьте ввічливими, уникайте образ та зберігайте дружню атмосферу. Якщо хочете обговорити сюжети, які можуть стати спойлером для інших — попереджайте заздалегідь! Приємного спілкування та нових відкриттів! 🔥"
    )
    
    past_time = timezone.now() - datetime.timedelta(days=365)
    
    for room in rooms:
        msg = Message.objects.create(room=room, author=kenzo, text=text)
        Message.objects.filter(id=msg.id).update(created_at=past_time)
        
    print("Created new messages.")
except Exception as e:
    print(f"Error: {e}")
