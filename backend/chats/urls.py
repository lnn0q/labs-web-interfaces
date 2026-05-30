from django.urls import path
from .views import ChatRoomListView, ChatRoomDetailView, MessageListView, ChatImageUploadView

urlpatterns = [
    path('rooms/', ChatRoomListView.as_view(), name='room_list'),
    path('rooms/<int:pk>/', ChatRoomDetailView.as_view(), name='room_detail'),
    path('rooms/<int:room_id>/messages/', MessageListView.as_view(), name='message_list'),
    path('upload-image/', ChatImageUploadView.as_view(), name='chat_image_upload'),
]

