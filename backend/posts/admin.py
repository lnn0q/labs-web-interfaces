from django.contrib import admin
from .models import Post, Comment, Like

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'fandom', 'created_at')
    list_filter = ('fandom', 'author')
    search_fields = ('title', 'content')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'created_at', 'text_excerpt')
    list_filter = ('post__fandom', 'author')
    search_fields = ('text',)

    def text_excerpt(self, obj):
        return obj.text[:50]
    text_excerpt.short_description = 'Текст коментаря'

class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post')
    list_filter = ('post__fandom',)
    search_fields = ('user__email', 'post__title')

admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Like, LikeAdmin)
