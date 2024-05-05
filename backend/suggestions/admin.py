from django.contrib import admin
from .models import StockSuggestion

class SuggestionsAdmin(admin.ModelAdmin):
    list_display = [field.name for field in StockSuggestion._meta.get_fields()]

admin.site.register(StockSuggestion, SuggestionsAdmin)
