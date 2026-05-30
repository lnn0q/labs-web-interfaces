from django.urls import path
from .views import PostListView, PostDetailView, CommentListView, PostLikeView

urlpatterns = [
    path('', PostListView.as_view(), name='post_list'),
    path('<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('<int:post_id>/comments/', CommentListView.as_view(), name='comment_list'),
    path('<int:post_id>/like/', PostLikeView.as_view(), name='post_like'),
]
