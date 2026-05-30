from rest_framework import serializers
from .models import Fandom, FandomMembership, FandomRequest
from accounts.serializers import UserSerializer

class FandomSerializer(serializers.ModelSerializer):
    members_count = serializers.ReadOnlyField()
    is_member = serializers.SerializerMethodField()
    image = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Fandom
        fields = ('id', 'name', 'slug', 'description', 'category', 'image_url', 'image', 'members_count', 'is_member', 'created_at')

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FandomMembership.objects.filter(user=request.user, fandom=obj).exists()
        return False

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        fandom = Fandom.objects.create(**validated_data)
        if image:
            fandom.image = image
            fandom.save()
            fandom.image_url = fandom.image.url
            fandom.save()
        return fandom

class FandomMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = FandomMembership
        fields = ('id', 'user', 'joined_at')

class FandomRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = FandomRequest
        fields = ('id', 'user', 'name', 'slug', 'description', 'category', 'image', 'status', 'admin_comment', 'created_at')
        read_only_fields = ('id', 'user', 'status', 'admin_comment', 'created_at')
