import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from chats.models import Message, ChatRoom
from django.contrib.auth import get_user_model

User = get_user_model()
mascot = User.objects.filter(email='kenzo@vohnik.ua').first()

if not mascot:
    print("Mascot user not found.")
    exit(1)

# Delete all messages
Message.objects.all().delete()
print("All messages deleted.")

# Recreate initial mascot messages in all chat rooms
text = "Привіт усім! Я Кензо, маскот цього затишного Вогника. ✨\n\nДавайте поважати один одного: будьте ввічливими, уникайте образ та зберігайте дружню атмосферу. Якщо хочете обговорити сюжети, які можуть стати спойлером для інших — попереджайте заздалегідь! Приємного спілкування та нових відкриттів! 🔥"

rooms = ChatRoom.objects.all()
for room in rooms:
    Message.objects.create(
        room=room,
        author=mascot,
        text=text
    )

print(f"Created initial mascot message in {rooms.count()} chat rooms.")
