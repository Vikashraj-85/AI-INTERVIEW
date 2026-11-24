from django.urls import path
from .views import InterviewListCreateView, InterviewDetailView, InterviewSubmitView
urlpatterns = [
    path("", InterviewListCreateView.as_view(), name="interview-list-create"),
    path("<int:pk>/", InterviewDetailView.as_view(), name="interview-detail"),
    path("<int:pk>/submit/", InterviewSubmitView.as_view(), name="interview-submit"),
]
