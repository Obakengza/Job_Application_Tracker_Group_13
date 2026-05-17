from django.contrib.auth.models import User
from django.db import connection
from rest_framework import serializers
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    username = serializers.CharField(required=False, allow_blank=True)

    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    province = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    role = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'phone',
            'address',
            'province',
            'country',
            'role',
        ]

    def create(self, validated_data):
        phone = validated_data.pop('phone', '')
        address = validated_data.pop('address', '')
        province = validated_data.pop('province', '')
        country = validated_data.pop('country', '')
        role = validated_data.pop('role', 'user')

        email = validated_data.get('email', '')
        username = validated_data.get('username') or email

        user = User.objects.create_user(
            username=username,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=email,
            password=validated_data['password']
        )

        Profile.objects.create(
            user=user,
            phone=phone,
            address=address,
            province=province,
            country=country,
            role=role
        )

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
                INSERT INTO users (
                    first_name,
                    last_name,
                    email,
                    password,
                    phone,
                    address,
                    province,
                    country,
                    role
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (email)
                DO UPDATE SET
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    password = EXCLUDED.password,
                    phone = EXCLUDED.phone,
                    address = EXCLUDED.address,
                    province = EXCLUDED.province,
                    country = EXCLUDED.country,
                    role = EXCLUDED.role
                """,
                [
                    user.first_name,
                    user.last_name,
                    user.email,
                    user.password,
                    phone,
                    address,
                    province,
                    country,
                    role,
                ]
            )

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email'
        ]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(write_only=True, required=False)

    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'first_name',
            'last_name',
            'email',
            'phone',
            'address',
            'province',
            'country',
            'bio',
            'university',
            'qualification',
            'certificates',
            'role',
            'created_at',
        ]

        read_only_fields = ['id', 'user', 'created_at']

    def update(self, instance, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        email = validated_data.pop('email', None)

        user = instance.user
        old_email = user.email
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if email:
            user.email = email
            user.username = email
        user.save()

        instance = super().update(instance, validated_data)

        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE users
                SET first_name = %s,
                    last_name = %s,
                    email = %s,
                    phone = %s,
                    address = %s,
                    province = %s,
                    country = %s,
                    role = %s
                WHERE email = %s OR email = %s
                """,
                [
                    user.first_name,
                    user.last_name,
                    user.email,
                    instance.phone,
                    instance.address,
                    instance.province,
                    instance.country,
                    instance.role,
                    user.email,
                    old_email,
                ]
            )

        return instance
