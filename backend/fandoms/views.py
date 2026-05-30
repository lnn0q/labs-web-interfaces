from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Fandom, FandomMembership, FandomRequest
from .serializers import FandomSerializer, FandomMembershipSerializer, FandomRequestSerializer
from chats.models import ChatRoom
from posts.models import Post

class FandomListView(generics.ListCreateAPIView):
    queryset = Fandom.objects.all()
    serializer_class = FandomSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        from rest_framework.exceptions import PermissionDenied
        if not self.request.user.is_staff:
            raise PermissionDenied("Тільки адміністратори можуть створювати нові фандоми.")
        serializer.save()

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

class FandomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fandom.objects.all()
    serializer_class = FandomSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticatedOrReadOnly()]
        return [permissions.IsAdminUser()]

class FandomJoinView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, slug):
        fandom = get_object_or_404(Fandom, slug=slug)
        FandomMembership.objects.get_or_create(user=request.user, fandom=fandom)
        return Response({"status": "joined"}, status=status.HTTP_200_OK)

class FandomLeaveView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, slug):
        fandom = get_object_or_404(Fandom, slug=slug)
        FandomMembership.objects.filter(user=request.user, fandom=fandom).delete()
        return Response({"status": "left"}, status=status.HTTP_200_OK)

class FandomMembersView(generics.ListAPIView):
    serializer_class = FandomMembershipSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        fandom = get_object_or_404(Fandom, slug=self.kwargs['slug'])
        return FandomMembership.objects.filter(fandom=fandom)

class FandomDeleteView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def delete(self, request, pk):
        fandom = get_object_or_404(Fandom, pk=pk)
        fandom.delete()
        return Response({"status": "deleted"}, status=status.HTTP_204_NO_CONTENT)

class FandomRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = FandomRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.is_staff:
            return FandomRequest.objects.all().order_by('-created_at')
        return FandomRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FandomRequestApproveView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, pk):
        fandom_request = get_object_or_404(FandomRequest, pk=pk)
        if fandom_request.status != 'pending':
            return Response({"error": "Цей запит вже оброблено."}, status=status.HTTP_400_BAD_REQUEST)

        fandom_request.status = 'approved'
        fandom_request.save()

        name = request.data.get('name', fandom_request.name)
        slug = request.data.get('slug', fandom_request.slug)
        description = request.data.get('description', fandom_request.description)
        category = request.data.get('category', fandom_request.category)

        fandom = Fandom.objects.create(
            name=name,
            slug=slug,
            description=description,
            category=category,
        )
        if fandom_request.image:
            fandom.image = fandom_request.image
            fandom.save()
            fandom.image_url = fandom.image.url
            fandom.save()

        chat_room = ChatRoom.objects.create(fandom=fandom, name="Загальний чат", room_type='general')

        from django.contrib.auth import get_user_model
        User = get_user_model()
        mascot = User.objects.filter(email='kenzo@takibi.ua').first()
        author = mascot if mascot else request.user

        Post.objects.create(
            fandom=fandom,
            title=f"Вітаємо у фандомі {fandom.name}!",
            content=f"Це перший офіційний пост фандому {fandom.name}. Діліться своїми враженнями, створюйте нові обговорення та спілкуйтеся в чаті!",
            author=author,
        )

        from chats.models import Message
        Message.objects.create(
            room=chat_room,
            author=author,
            text="Привіт усім! Я Кензо, маскот затишного Takibi. ✨\n\nДавайте поважати один одного: будьте ввічливими, уникайте образ та зберігайте дружню атмосферу. Якщо хочете обговорити сюжети, які можуть стати спойлером для інших — попереджайте заздалегідь! Приємного спілкування та нових відкриттів! 🔥"
        )

        return Response({"status": "approved", "fandom_id": fandom.id}, status=status.HTTP_200_OK)

class FandomRequestRejectView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, pk):
        fandom_request = get_object_or_404(FandomRequest, pk=pk)
        if fandom_request.status != 'pending':
            return Response({"error": "Цей запит вже оброблено."}, status=status.HTTP_400_BAD_REQUEST)

        fandom_request.status = 'rejected'
        fandom_request.admin_comment = request.data.get('comment', '')
        fandom_request.save()
        return Response({"status": "rejected"}, status=status.HTTP_200_OK)

class UserFandomsView(generics.ListAPIView):
    serializer_class = FandomSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Fandom.objects.filter(memberships__user=self.request.user)
