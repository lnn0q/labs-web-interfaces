from django.contrib import admin
from .models import ChatRoom, Message

class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'fandom', 'room_type', 'created_at')
    list_filter = ('room_type', 'fandom')
    search_fields = ('name', 'fandom__name')

class MessageAdmin(admin.ModelAdmin):
    list_display = ('author', 'room', 'text_excerpt', 'created_at')
    list_filter = ('room', 'room__fandom')
    search_fields = ('author__email', 'author__name', 'text')

    def text_excerpt(self, obj):
        return obj.text[:50]
    text_excerpt.short_description = 'Текст повідомлення'

admin.site.register(ChatRoom, ChatRoomAdmin)
admin.site.register(Message, MessageAdmin)
