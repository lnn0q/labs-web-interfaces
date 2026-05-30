from django.contrib import admin
from .models import Fandom, FandomMembership, FandomRequest

class FandomAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

class FandomMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'fandom', 'joined_at')
    list_filter = ('fandom',)
    search_fields = ('user__email', 'user__name', 'fandom__name')

class FandomRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'category', 'status', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('name', 'description', 'user__email')
    actions = ['approve_requests']

    @admin.action(description='Схвалити вибрані запити та створити фандоми')
    def approve_requests(self, request, queryset):
        from chats.models import ChatRoom, Message
        from posts.models import Post
        from django.contrib.auth import get_user_model
        
        User = get_user_model()
        mascot = User.objects.filter(email='kenzo@takibi.ua').first()
        author = mascot if mascot else request.user

        approved_count = 0
        for req in queryset.filter(status='pending'):
            req.status = 'approved'
            req.save()

            fandom = Fandom.objects.create(
                name=req.name,
                slug=req.slug,
                description=req.description,
                category=req.category,
            )
            if req.image:
                fandom.image = req.image
                fandom.save()
                fandom.image_url = fandom.image.url
                fandom.save()

            chat_room = ChatRoom.objects.create(fandom=fandom, name="Загальний чат", room_type='general')

            Post.objects.create(
                fandom=fandom,
                title=f"Вітаємо у фандомі {fandom.name}!",
                content=f"Це перший офіційний пост фандому {fandom.name}. Діліться своїми враженнями, створюйте нові обговорення та спілкуйтеся в чаті!",
                author=author,
            )

            Message.objects.create(
                room=chat_room,
                author=author,
                text="Привіт усім! Я Кензо, маскот затишного Takibi. ✨\n\nДавайте поважати один одного: будьте ввічливими, уникайте образ та зберігайте дружню атмосферу. Якщо хочете обговорити сюжети, які можуть стати спойлером для інших — попереджайте заздалегідь! Приємного спілкування та нових відкриттів! 🔥"
            )
            approved_count += 1
        
        self.message_user(request, f"{approved_count} запитів було успішно схвалено та створено фандоми.")

admin.site.register(Fandom, FandomAdmin)
admin.site.register(FandomMembership, FandomMembershipAdmin)
admin.site.register(FandomRequest, FandomRequestAdmin)
