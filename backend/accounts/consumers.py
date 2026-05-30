import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

class OnlineUsersConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            await self.channel_layer.group_add("online_users", self.channel_name)
            await self.set_online_status(True)
            await self.accept()
            await self.broadcast_online_users()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard("online_users", self.channel_name)
            await self.set_online_status(False)
            await self.broadcast_online_users()

    @database_sync_to_async
    def set_online_status(self, is_online):
        self.user.is_online = is_online
        self.user.save(update_fields=["is_online", "last_seen"])

    @database_sync_to_async
    def get_online_users(self):
        users = User.objects.filter(is_online=True)
        return [{"id": u.id, "name": u.name, "email": u.email} for u in users]

    async def broadcast_online_users(self):
        users = await self.get_online_users()
        await self.channel_layer.group_send(
            "online_users",
            {
                "type": "online_list_update",
                "users": users
            }
        )

    async def online_list_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "online_users",
            "users": event["users"]
        }))
