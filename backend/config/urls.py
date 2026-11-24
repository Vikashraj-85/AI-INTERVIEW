from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return JsonResponse({"message":"AI Interview Platform API","status":"success","endpoints":["/api/auth/","/api/interviews/","/api/resumes/"]})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", home, name="api-home"),
    path("api/auth/", include("accounts.urls")),
    path("api/interviews/", include("interviews.urls")),
    path("api/resumes/", include("resumes.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
