from django.urls import path
from .views import (
    FandomListView, FandomDetailView, FandomJoinView, FandomLeaveView,
    FandomMembersView, FandomDeleteView,
    FandomRequestListCreateView, FandomRequestApproveView, FandomRequestRejectView,
    UserFandomsView
)

urlpatterns = [
    path('', FandomListView.as_view(), name='fandom_list'),
    path('mine/', UserFandomsView.as_view(), name='fandom_mine'),
    path('requests/', FandomRequestListCreateView.as_view(), name='fandom_requests'),
    path('requests/<int:pk>/approve/', FandomRequestApproveView.as_view(), name='fandom_request_approve'),
    path('requests/<int:pk>/reject/', FandomRequestRejectView.as_view(), name='fandom_request_reject'),
    path('<int:pk>/delete/', FandomDeleteView.as_view(), name='fandom_delete'),
    path('<slug:slug>/', FandomDetailView.as_view(), name='fandom_detail'),
    path('<slug:slug>/join/', FandomJoinView.as_view(), name='fandom_join'),
    path('<slug:slug>/leave/', FandomLeaveView.as_view(), name='fandom_leave'),
    path('<slug:slug>/members/', FandomMembersView.as_view(), name='fandom_members'),
]
