from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class OnlineUsersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return User.objects.filter(is_online=True)

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')

class AdminUserDeleteView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Користувача не знайдено"}, status=status.HTTP_404_NOT_FOUND)
        if user.is_superuser:
            return Response({"error": "Неможливо видалити суперадміністратора"}, status=status.HTTP_403_FORBIDDEN)
        user.delete()
        return Response({"status": "deleted"}, status=status.HTTP_204_NO_CONTENT)

class AdminUserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

    def perform_update(self, serializer):
        user = serializer.save()
        # Admin might update is_staff status, let's allow it manually if present in request data
        if 'is_staff' in self.request.data:
            is_staff = self.request.data.get('is_staff')
            if isinstance(is_staff, str):
                is_staff = is_staff.lower() in ['true', '1', 'yes']
            user.is_staff = bool(is_staff)
            user.save()
