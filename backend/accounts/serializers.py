from django.contrib.auth.models import User
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

    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'phone',
            'address',
            'province',
            'country',
            'role',
            'created_at',
        ]

        read_only_fields = ['id', 'user', 'created_at']