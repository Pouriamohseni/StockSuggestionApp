from django.db import models
from users.models import User
from django.core.exceptions import ValidationError

CAP_SIZE = [
    ("s", "small"), 
    ("m", "medium"),
    ("l", "large")
]


class Stock(models.Model):
    ticker = models.CharField(max_length=9, unique=True)
    name = models.CharField(max_length=100)
    price = models.FloatField()
    week_growth = models.FloatField()
    five_year_growth = models.FloatField()
    cap_size = models.CharField(choices=CAP_SIZE, max_length=2)

def non_negative_validator(value):
    if value < 0:
        raise ValidationError('Shares must be non-negative.')
class UserStocks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stocks = models.ForeignKey(Stock, on_delete=models.CASCADE)
    shares = models.FloatField(default=0, blank=True, validators=[non_negative_validator])
    
    class Meta:
        unique_together = ['user', 'stocks']
