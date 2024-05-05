from django.contrib import admin
from django.urls import path
from users.views import (
    ViewUsers,
    ViewUserPortfolio,
    user_edit_profile,
    user_get_profile,
    ViewUserCashBalance
)
from stocks.views import ViewStocks, ViewUserStocks
from suggestions.views import ViewStocksSuggestions, user_select_suggestion

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', ViewUsers.as_view(), name='user'),
    path('user_get_profile/', user_get_profile, name='user_get_profile'),
    path('user_edit_profile/', user_edit_profile, name='user_edit_profile'),
    path('stocks/', ViewStocks.as_view(), name='stocks'),
    path('user_stocks/', ViewUserStocks.as_view(), name='user_stocks'),
    path('user_portfolio/', ViewUserPortfolio.as_view(), name='user_portfolio'),
   #path('user_portfolio_actual/', ViewUserPortfolioActual.as_view(), name='user_portfolio_actual'),
    path('stocks_suggestions/', ViewStocksSuggestions.as_view(), name='stocks_suggestions'),
    path('user_select_suggestion/', user_select_suggestion, name='user_select_suggestion'),
    path('user_cash_balance/', ViewUserCashBalance.as_view(), name='user_cash_balance')
]
