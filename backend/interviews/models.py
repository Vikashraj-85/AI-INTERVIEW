from django.conf import settings
from django.db import models

class InterviewSession(models.Model):
    TYPE_CHOICES = [(x, x) for x in ("Technical", "Behavioral", "Mixed", "HR")]
    LEVEL_CHOICES = [(x, x) for x in ("Beginner", "Intermediate", "Advanced")]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="interview_sessions")
    role = models.CharField(max_length=120, default="Software Engineer")
    type = models.CharField(max_length=30, default="Technical")
    level = models.CharField(max_length=30, default="Intermediate")
    duration = models.PositiveSmallIntegerField(default=15)
    questions = models.JSONField(default=list)
    answers = models.JSONField(default=dict, blank=True)
    score = models.PositiveSmallIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    strengths = models.JSONField(default=list, blank=True)
    improvements = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, default="in_progress")
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.user} - {self.role} ({self.created_at:%Y-%m-%d})"
