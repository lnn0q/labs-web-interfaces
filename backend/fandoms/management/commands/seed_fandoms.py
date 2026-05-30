import os
import urllib.request
import datetime
from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from fandoms.models import Fandom
from chats.models import ChatRoom, Message
from posts.models import Post

User = get_user_model()

def download_fandom_image(url, slug):
    if slug in ['naruto', 'rick-and-morty']:
        return url
    
    media_dir = os.path.join(settings.MEDIA_ROOT, 'fandoms')
    
    for ext in ['.png', '.jpg']:
        file_name = f"{slug}{ext}"
        file_path = os.path.join(media_dir, file_name)
        if os.path.exists(file_path):
            return f"/media/fandoms/{file_name}"
            
    os.makedirs(media_dir, exist_ok=True)
    ext = '.png' if '.png' in url.lower() else '.jpg'
    file_name = f"{slug}{ext}"
    file_path = os.path.join(media_dir, file_name)
    
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(file_path, 'wb') as f:
                f.write(response.read())
        return f"/media/fandoms/{file_name}"
    except Exception as e:
        print(f"Error downloading image for {slug}: {e}")
        return url

class Command(BaseCommand):
    help = 'Seeds the database with initial fandoms, chats, and posts'

    def handle(self, *args, **options):
        fandoms_data = [
            {"name": "Naruto", "slug": "naruto", "category": "anime", "description": "Фандом для любителів Наруто.", "image_url": "https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg4YjktOGY5Yzc2MDUxMTE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UX1000_.jpg"},
            {"name": "Steins Gate", "slug": "steins-gate", "category": "anime", "description": "Ель Псай Конгру.", "image_url": "https://m.media-amazon.com/images/M/MV5BMjUxMzE4ZDctODNjMS00MzIwLThjNDktODkwYjc5YWU0MDc0XkEyXkFqcGdeQXVyNjc3OTE4NDY@._V1_FMjpg_UX1000_.jpg"},
            {"name": "Noragami", "slug": "noragami", "category": "anime", "description": "Бездомний бог Ято.", "image_url": "https://m.media-amazon.com/images/M/MV5BMjM1MTYxNDMzN15BMl5BanBnXkFtZTgwMDY0MjQ4MTE@._V1_FMjpg_UX1000_.jpg"},
            {"name": "Pandora Hearts", "slug": "pandora-hearts", "category": "anime", "description": "Темне фентезі.", "image_url": "https://m.media-amazon.com/images/M/MV5BZTA0YzYyOWYtNTczYy00MTZlLTlkNjctYjE1ZmIzOGIyODcxXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg"},
            {"name": "Cowboy Bebop", "slug": "cowboy-bebop", "category": "anime", "description": "Космічний вестерн.", "image_url": "https://m.media-amazon.com/images/M/MV5BNGNlNjAwYjctZDg2NS00MzlkLWE3ZWMtNWZlYjM0NTEwMTIzXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UX1000_.jpg"},
            {"name": "Love is War", "slug": "love-is-war", "category": "anime", "description": "Війна умів.", "image_url": "https://m.media-amazon.com/images/M/MV5BZDU1NzM4ZjctMjliMi00ZmFjLTk5ZTYtNTBmNzllOGVjYWZkXkEyXkFqcGdeQXVyNjc3OTE4NDY@._V1_.jpg"},
            {"name": "Konosuba", "slug": "konosuba", "category": "anime", "description": "Комедійний ісекай.", "image_url": "https://m.media-amazon.com/images/M/MV5BYzA4NThlNjctNTQwNy00NmE4LTg3NjAtMzA1ZjhlNDg0MzIxXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"},
            {"name": "Re:Zero", "slug": "rezero", "category": "anime", "description": "Життя в іншому світі з нуля.", "image_url": "https://m.media-amazon.com/images/M/MV5BN2NlM2Y5Y2MtYjU5Mi00ZjNiLWFjNjItOThkOWJmNzFhZjZkXkEyXkFqcGdeQXVyNjc3OTE4NDY@._V1_.jpg"},
            {"name": "Rick and Morty", "slug": "rick-and-morty", "category": "series", "description": "Науково-фантастичні пригоди.", "image_url": "https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00YzMyLThkMmYtMjEwNmQyNzliYTNmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_.jpg"},
            {"name": "Mother of Learning", "slug": "mother-of-learning", "category": "books", "description": "Петля часу та магія.", "image_url": "https://m.media-amazon.com/images/I/41K-vA1b02L.jpg"},
            {"name": "Worth the Candle", "slug": "worth-the-candle", "category": "books", "description": "ЛітрПГ фентезі.", "image_url": "https://m.media-amazon.com/images/I/41-94zF3s+L._BO1,204,203,200_.jpg"},
            {"name": "A Practical Guide to Evil", "slug": "a-practical-guide-to-evil", "category": "books", "description": "Практичний посібник для лиходіїв.", "image_url": "https://m.media-amazon.com/images/I/51Bqj9o2l4L._BO1,204,203,200_.jpg"},
            {"name": "SCP Foundation", "slug": "scp", "category": "other", "description": "Убезпечити, Втримати, Зберегти.", "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/SCP_Foundation_%28emblem%29.svg/1200px-SCP_Foundation_%28emblem%29.svg.png"},
        ]

        admin_user, created = User.objects.get_or_create(
            email='admin@vohnik.ua',
            defaults={'name': 'Адміністратор', 'is_staff': True, 'is_superuser': True}
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()

        bohdan_user, created = User.objects.get_or_create(
            email='denysenko.bohdan@lll.kpi.ua',
            defaults={'name': 'Богдан Денисенко', 'is_staff': True, 'is_superuser': True}
        )
        if created or not bohdan_user.is_superuser:
            bohdan_user.set_password('11062003')
            bohdan_user.is_staff = True
            bohdan_user.is_superuser = True
            bohdan_user.save()

        mascot_user, created = User.objects.get_or_create(
            email='kenzo@vohnik.ua',
            defaults={'name': 'Кензо', 'avatar': 'avatars/kenzo.png', 'is_staff': False, 'is_superuser': False}
        )
        if created:
            mascot_user.set_password('kenzopass123')
            mascot_user.save()
        else:
            mascot_user.name = 'Кензо'
            mascot_user.avatar = 'avatars/kenzo.png'
            mascot_user.save()

        for data in fandoms_data:
            data['image_url'] = download_fandom_image(data['image_url'], data['slug'])
            fandom, _ = Fandom.objects.update_or_create(slug=data['slug'], defaults=data)
            
            chat_room, _ = ChatRoom.objects.get_or_create(fandom=fandom, name="Загальний чат", defaults={'room_type': 'general'})
            
            post, _ = Post.objects.get_or_create(fandom=fandom, title=f"Вітаємо у фандомі {fandom.name}!", defaults={
                'content': f"Це перший офіційний пост фандому {fandom.name}. Діліться своїми враженнями, створюйте нові обговорення та спілкуйтеся в чаті!",
                'author': mascot_user
            })
            if post.author != mascot_user:
                post.author = mascot_user
                post.save()

            welcome_text = (
                f"Привіт усім! Я Кензо, маскот Takibi - цього затишного Вогнища. ✨\n\n"
                f"Давайте поважати один одного: будьте ввічливими, уникайте образ та зберігайте дружню атмосферу. Якщо хочете обговорити сюжети, які можуть стати спойлером для інших — попереджайте заздалегідь! Приємного спілкування та нових відкриттів! 🔥"
            )

            msg, msg_created = Message.objects.get_or_create(
                room=chat_room,
                author=mascot_user,
                defaults={'text': welcome_text}
            )
            if msg_created:
                past_time = timezone.now() - datetime.timedelta(days=365)
                Message.objects.filter(id=msg.id).update(created_at=past_time)
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded fandoms, chats, and posts'))
