from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from django.db import connection, transaction
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile
from .activity import log_activity
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class PlainSQLLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username") or request.data.get("email")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Username/email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, username, email, first_name, last_name, password
                FROM auth_user
                WHERE username = %s OR email = %s
                LIMIT 1
                """,
                [username, username]
            )
            user = cursor.fetchone()

        if not user or not check_password(password, user[5]):
            return Response(
                {"detail": "No active account found with the given credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        auth_user_id, db_username, email, first_name, last_name, password_hash = user

        with transaction.atomic():
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    CREATE TABLE IF NOT EXISTS users (
                        user_id SERIAL PRIMARY KEY,
                        first_name VARCHAR(100) NOT NULL,
                        last_name VARCHAR(100) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        phone VARCHAR(20),
                        address TEXT,
                        province VARCHAR(100),
                        country VARCHAR(100),
                        role VARCHAR(50) DEFAULT 'user',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """
                )
                cursor.execute(
                    """
                    CREATE TABLE IF NOT EXISTS activity_log (
                        log_id SERIAL PRIMARY KEY,
                        user_id INT NOT NULL,
                        activity_type VARCHAR(100) NOT NULL,
                        activity_description TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_log_user
                        FOREIGN KEY (user_id)
                        REFERENCES users(user_id)
                        ON DELETE CASCADE
                    )
                    """
                )
                cursor.execute(
                    """
                    INSERT INTO users (first_name, last_name, email, password, role)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (email)
                    DO UPDATE SET
                        first_name = EXCLUDED.first_name,
                        last_name = EXCLUDED.last_name,
                        password = EXCLUDED.password
                    RETURNING user_id
                    """,
                    [
                        first_name or db_username or email,
                        last_name or "",
                        email or db_username,
                        password_hash,
                        "user",
                    ]
                )
                saved_user_id = cursor.fetchone()[0]
                cursor.execute(
                    """
                    INSERT INTO activity_log (
                        user_id,
                        activity_type,
                        activity_description
                    )
                    VALUES (%s, %s, %s)
                    """,
                    [
                        saved_user_id,
                        "login",
                        f"User {email or db_username} logged in",
                    ]
                )

        refresh = RefreshToken()
        refresh[api_settings.USER_ID_CLAIM] = auth_user_id

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_200_OK
        )


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if email != "admin@gmail.com" or password != "cmpgadmin":
            return Response(
                {"detail": "Invalid admin email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        log_activity(
            email=email,
            activity_type="admin_login",
            activity_description=f"Admin {email} logged in",
            first_name="System",
            last_name="Admin",
            password=password,
            role="admin",
        )

        return Response(
            {"message": "Admin logged in successfully."},
            status=status.HTTP_200_OK
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            log_activity(
                email=request.user.email,
                activity_type="logout",
                activity_description=f"User {request.user.email} logged out",
                first_name=request.user.first_name,
                last_name=request.user.last_name,
                password=request.user.password,
                role="user",
            )

            return Response(
                {"message": "Logged out successfully."},
                status=status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {"error": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile
