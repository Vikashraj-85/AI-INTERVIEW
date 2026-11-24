from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({"id":user.id,"username":user.username,"email":user.email,"first_name":user.first_name,"last_name":user.last_name})
    def patch(self, request):
        user=request.user
        for field in ("email","first_name","last_name"):
            if field in request.data:
                value=str(request.data[field]).strip()
                if field=="email" and value and User.objects.exclude(pk=user.pk).filter(email__iexact=value).exists():
                    return Response({"email":["This email is already in use."]},status=400)
                setattr(user,field,value[:150])
        user.save()
        return self.get(request)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            token=RefreshToken(request.data["refresh"]); token.blacklist()
        except Exception:
            pass
        return Response({"message":"Logout successful"})
