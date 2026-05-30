from django.urls import re_path
from accounts.consumers import OnlineUsersConsumer
from chats.consumers import ChatConsumer
from notifications.consumers import AdminTaskConsumer

websocket_urlpatterns = [
    re_path(r'ws/online/$', OnlineUsersConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_id>\w+)/$', ChatConsumer.as_asgi()),
    re_path(r'ws/admin/tasks/$', AdminTaskConsumer.as_asgi()),
]
