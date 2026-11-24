from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Resume
from .serializers import ResumeSerializer

class ResumeListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return Resume.objects.filter(user=self.request.user).order_by("-created_at")
    def perform_create(self, serializer):
        f = self.request.FILES.get("file")
        serializer.save(user=self.request.user, title=self.request.data.get("title") or (f.name if f else "Resume"))

class ResumeDeleteView(generics.DestroyAPIView):
    """Delete only the authenticated user's own resume and its uploaded file."""
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.file:
            instance.file.delete(save=False)
        instance.delete()


class ResumeAnalyzeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        try: resume = Resume.objects.get(pk=pk, user=request.user)
        except Resume.DoesNotExist: return Response({"detail":"Resume not found."}, status=404)
        try:
            from pypdf import PdfReader
            reader = PdfReader(resume.file.path)
            text = "\n".join((page.extract_text() or "") for page in reader.pages[:20]).strip()
        except ImportError:
            return Response({"detail":"Install pypdf in the backend environment to analyze PDF files."}, status=503)
        except Exception:
            return Response({"detail":"This PDF could not be read. Try a non-password-protected PDF."}, status=400)
        if not text:
            return Response({"detail":"No selectable text found. Scanned PDFs need OCR; try a text-based PDF."}, status=400)
        import re
        skills = ["Python","Java","JavaScript","React","Django","SQL","HTML","CSS","REST API","Git","AWS","Docker","Machine Learning","C++","Node.js","TypeScript"]
        found = [skill for skill in skills if re.search(re.escape(skill), text, re.I)]
        email = bool(re.search(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", text))
        phone = bool(re.search(r"(?:\+?\d[\d\s()-]{8,}\d)", text))
        sections = [s for s in ["education","experience","projects","skills","certifications"] if s in text.lower()]
        resume.extracted_text = text[:30000]
        resume.analysis = {
            "summary": f"Extracted {len(text.split())} words from your resume. This is a basic local scan, not an AI-generated assessment.",
            "skills_found": found,
            "sections_found": sections,
            "word_count": len(text.split()),
            "contact_checks": {"email_found": email, "phone_found": phone},
            "suggestions": (["Add a clearly labeled Skills section."] if "skills" not in sections else []) + (["Add measurable results to experience/project bullets."] if not re.search(r"\b(\d+%|increased|reduced|improved|built|developed)\b", text, re.I) else []) + (["Include project descriptions and technologies used."] if "projects" not in sections else []),
        }
        resume.save(update_fields=["extracted_text","analysis"])
        return Response(ResumeSerializer(resume, context={"request":request}).data)
