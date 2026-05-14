from rest_framework.test import APITestCase
from rest_framework import status


class AuthTests(APITestCase):

    def test_register_user(self):
        url = "/api/auth/register/"

        data = {
            "first_name": "Blessed",
            "last_name": "Maake",
            "email": "testuser@gmail.com",
            "password": "12345678"
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):

        register_url = "/api/auth/register/"
        login_url = "/api/auth/login/"

        user_data = {
            "first_name": "Blessed",
            "last_name": "Maake",
            "email": "testlogin@gmail.com",
            "password": "12345678"
        }

        self.client.post(register_url, user_data, format="json")

        login_data = {
            "username": "testlogin@gmail.com",
            "password": "12345678"
        }

        response = self.client.post(login_url, login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_current_user_requires_authentication(self):

        url = "/api/auth/user/"

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)