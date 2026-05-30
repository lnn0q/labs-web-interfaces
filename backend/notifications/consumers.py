import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import AsyncTaskResult
from channels.db import database_sync_to_async

class AdminTaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated and self.user.is_staff:
            await self.channel_layer.group_add("admin_tasks", self.channel_name)
            await self.accept()
            await self.send_initial_tasks()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated and self.user.is_staff:
            await self.channel_layer.group_discard("admin_tasks", self.channel_name)

    @database_sync_to_async
    def get_recent_tasks(self):
        tasks = AsyncTaskResult.objects.all()[:20]
        return [{
            "id": t.id,
            "task_name": t.task_name,
            "task_data": t.task_data,
            "result": t.result,
            "status": t.status,
            "completed_at": t.completed_at.isoformat() if t.completed_at else None
        } for t in tasks]

    async def send_initial_tasks(self):
        tasks = await self.get_recent_tasks()
        await self.send(text_data=json.dumps({
            "type": "initial_tasks",
            "tasks": tasks
        }))

    async def task_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "task_update",
            "task": event["task"]
        }))
