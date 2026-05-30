from django.contrib import admin
from .models import AsyncTaskResult

class AsyncTaskResultAdmin(admin.ModelAdmin):
    list_display = ('task_name', 'status', 'completed_at')
    list_filter = ('status',)
    search_fields = ('task_name', 'task_data', 'result')

admin.site.register(AsyncTaskResult, AsyncTaskResultAdmin)
