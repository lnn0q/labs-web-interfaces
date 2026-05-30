from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

class ChatRoomListView(generics.ListCreateAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        queryset = ChatRoom.objects.all()
        fandom_slug = self.request.query_params.get('fandom')
        if fandom_slug:
            queryset = queryset.filter(fandom__slug=fandom_slug)
        return queryset

class ChatRoomDetailView(generics.RetrieveAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Message.objects.filter(room_id=self.kwargs['room_id'])

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, room_id=self.kwargs['room_id'])

class ChatImageUploadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('image')
        if not file_obj:
            return Response({"error": "Файл не надано"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_path = default_storage.save(f'chat_images/{file_obj.name}', file_obj)
        relative_url = f'/media/{file_path}'
        return Response({
            "relative_path": file_path,
            "url": relative_url
        }, status=status.HTTP_201_CREATED)
