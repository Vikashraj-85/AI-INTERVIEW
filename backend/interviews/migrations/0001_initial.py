from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(name="InterviewSession", fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("role", models.CharField(default="Software Engineer", max_length=120)),
            ("type", models.CharField(default="Technical", max_length=30)),
            ("level", models.CharField(default="Intermediate", max_length=30)),
            ("duration", models.PositiveSmallIntegerField(default=15)),
            ("questions", models.JSONField(default=list)),
            ("answers", models.JSONField(blank=True, default=dict)),
            ("score", models.PositiveSmallIntegerField(blank=True, null=True)),
            ("feedback", models.TextField(blank=True)),
            ("strengths", models.JSONField(blank=True, default=list)),
            ("improvements", models.JSONField(blank=True, default=list)),
            ("status", models.CharField(default="in_progress", max_length=20)),
            ("created_at", models.DateTimeField(auto_now_add=True)),
            ("completed_at", models.DateTimeField(blank=True, null=True)),
            ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="interview_sessions", to=settings.AUTH_USER_MODEL)),
        ]),
    ]
