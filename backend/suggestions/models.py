from django.db import models
from users.models import User
from stocks.models import Stock

class StockSuggestion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    iteration = models.IntegerField(default=0, null=False)
    shares = models.FloatField(default=0)
    price_per_share = models.FloatField(default=0)
    creation_time = models.DateTimeField(auto_now_add=True, null=False)

