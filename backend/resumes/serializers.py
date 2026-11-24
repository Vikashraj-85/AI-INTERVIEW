from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    has_analysis = serializers.SerializerMethodField()
    class Meta:
        model = Resume
        fields = ["id","title","file","analysis","has_analysis","created_at"]
        read_only_fields = ["id","analysis","has_analysis","created_at"]
    def get_has_analysis(self, obj):
        return bool(obj.analysis)
    def validate_file(self, value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Please upload a PDF file.")
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("PDF must be smaller than 10 MB.")
        return value
