from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'auth-register': reverse('auth_register', request=request, format=format),
        'auth-login': reverse('auth_login', request=request, format=format),
        'auth-profile': reverse('auth_profile', request=request, format=format),
        'fandoms': reverse('fandom_list', request=request, format=format),
        'posts': reverse('post_list', request=request, format=format),
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/', api_root, name='api-root'),
    path('api/auth/', include('accounts.urls')),
    path('api/fandoms/', include('fandoms.urls')),
    path('api/chats/', include('chats.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/notifications/', include('notifications.urls')),
    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
