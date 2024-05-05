from django.contrib import admin
from .models import User, UserPortfolio, UserCashBalance

# Register your models here.

class UsersAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'email',
        'first_name',
        'last_name',
        'is_superuser',
    )

class PortfolioAdmin(admin.ModelAdmin):
    list_display = [field.name for field in UserPortfolio._meta.get_fields()]

class CashBalanceAdmin(admin.ModelAdmin):
    list_display = [field.name for field in UserCashBalance._meta.get_fields()]

admin.site.register(UserPortfolio, PortfolioAdmin)
admin.site.register(User, UsersAdmin)
admin.site.register(UserCashBalance, CashBalanceAdmin)
