from django.urls import path
from .views import ResumeListCreateView, ResumeAnalyzeView, ResumeDeleteView
urlpatterns = [
    path("", ResumeListCreateView.as_view(), name="resume-list-create"),
    path("<int:pk>/", ResumeDeleteView.as_view(), name="resume-delete"),
    path("<int:pk>/analyze/", ResumeAnalyzeView.as_view(), name="resume-analyze"),
]
