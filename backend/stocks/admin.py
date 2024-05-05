from django.contrib import admin
from .models import Stock

# Register your models here.
class StockAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'ticker',
        'price',
        'week_growth',
        'five_year_growth',
        'cap_size',
    )

admin.site.register(Stock, StockAdmin)