from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'name', 'gender', 'date_of_birth', 'is_online', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser', 'is_online', 'gender')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Особиста інформація', {'fields': ('name', 'gender', 'date_of_birth', 'avatar', 'bio', 'is_online')}),
        ('Права доступу', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важливі дати', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password', 'gender', 'date_of_birth'),
        }),
    )
    search_fields = ('email', 'name')
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)
