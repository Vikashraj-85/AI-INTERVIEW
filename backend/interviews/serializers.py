from rest_framework import serializers
from .models import InterviewSession

class InterviewSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSession
        fields = ["id","role","type","level","duration","questions","answers","score","feedback","strengths","improvements","status","created_at","completed_at"]
        read_only_fields = ["id","questions","answers","score","feedback","strengths","improvements","status","created_at","completed_at"]
