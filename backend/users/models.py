from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)
from .UsersManager import UsersManager
import uuid


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False, blank=True)
    is_active = models.BooleanField(default=True, blank=True)
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, null=False, primary_key=True)
    objects = UsersManager()

    USERNAME_FIELD = "email"  # Use 'email' as the unique identifier for authentication
    REQUIRED_FIELDS = []  # No additional fields are required during user creation

    def __str__(self):
        return self.email
    

class UserPortfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
    small_cap_percentage = models.FloatField()
    medium_cap_percentage = models.FloatField()
    large_cap_percentage = models.FloatField()


class UserCashBalance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
    current_cash_balance = models.FloatField()
    proj_1year_balance = models.FloatField()
    proj_5year_balance = models.FloatField()


