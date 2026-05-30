from rest_framework import serializers
from .models import ChatRoom, Message
from accounts.serializers import UserSerializer

class ChatRoomSerializer(serializers.ModelSerializer):
    fandom_name = serializers.CharField(source='fandom.name', read_only=True)

    class Meta:
        model = ChatRoom
        fields = ('id', 'fandom', 'fandom_name', 'name', 'room_type', 'created_at')

class MessageSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('author', 'is_edited', 'created_at')
