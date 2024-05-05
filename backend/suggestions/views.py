from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from django.db import connection
import json

from users.models import UserCashBalance

from stocks.models import Stock, UserStocks
from stocks.views import UserStockSerializer, StocksSerializer

from .models import StockSuggestion

class StockSuggestionSerializer(serializers.ModelSerializer):
    stock = StocksSerializer()

    class Meta:
        model = StockSuggestion
        fields = [
            'stock',
            'iteration',
            'shares',
            'price_per_share',
            'creation_time',
        ]

class ViewStocksSuggestions(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        data = request.data
        user = request.user
        cap_size_portfolio = json.loads(data['cap_size_portfolio'])
        buying_power = float(data['buying_power'])

        current_cash = UserCashBalance.objects.raw(f"""
            SELECT * FROM users_usercashbalance
            WHERE user_id = %s
        """, [user.id])[0]

        if buying_power > current_cash.current_cash_balance or buying_power < 0:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Get user's stocks
        stock_list = UserStocks.objects.raw("SELECT * FROM stocks_userstocks WHERE user_id = %s", [user.id])
        stock_list = UserStockSerializer(stock_list, many=True).data

        current_holdings = 0
        large_cap_list = []
        medium_cap_list = []
        small_cap_list = []
        # Classify and calculate current holdings
        for stock in stock_list:
            current_holdings += stock["stocks"]["price"] * stock["shares"]
            stock["stocks"]["shares"] = stock["shares"]
            if stock["stocks"]["cap_size"] == "l":
                large_cap_list.append(stock["stocks"])
            elif stock["stocks"]["cap_size"] == "m":
                medium_cap_list.append(stock["stocks"])
            else:
                small_cap_list.append(stock["stocks"])

        # Get net holdings for each cap size with new cash amount
        power_partition = {
            cap_size: (buying_power + current_holdings) * (cap_size_portfolio[cap_size]/100)
            for cap_size in cap_size_portfolio.keys()
        }

        # Average cost per company (not per single stock of a company)
        avg_large_cap_cost = (power_partition["large_cap"] / len(large_cap_list) if len(large_cap_list) != 0 else 0)
        avg_medium_cap_cost = (power_partition["medium_cap"] / len(medium_cap_list) if len(medium_cap_list) != 0 else 0)
        avg_small_cap_cost = (power_partition["small_cap"] / len(small_cap_list) if len(small_cap_list) != 0 else 0)
        
        for stock in large_cap_list:
            if avg_large_cap_cost > (stock["price"] * stock["shares"]):
                total_stock_cost = (avg_large_cap_cost - (stock["price"] * stock["shares"]))
                if total_stock_cost > buying_power * (cap_size_portfolio["large_cap"]/(len(large_cap_list)*100)):
                    total_stock_cost = buying_power * (cap_size_portfolio["large_cap"]/(len(large_cap_list)*100))
                stock["buy"] = round(total_stock_cost / stock["price"], 2)
        for stock in medium_cap_list:
            if avg_medium_cap_cost > (stock["price"] * stock["shares"]):
                total_stock_cost = (avg_medium_cap_cost - (stock["price"] * stock["shares"]))
                if total_stock_cost > buying_power * (cap_size_portfolio["medium_cap"]/(len(medium_cap_list)*100)):
                    total_stock_cost = buying_power * (cap_size_portfolio["medium_cap"]/(len(medium_cap_list)*100))
                stock["buy"] = round(total_stock_cost / stock["price"], 2)
        for stock in small_cap_list:
            if avg_small_cap_cost > (stock["price"] * stock["shares"]):
                total_stock_cost = (avg_small_cap_cost - (stock["price"] * stock["shares"]))
                if total_stock_cost > buying_power * (cap_size_portfolio["small_cap"]/(len(small_cap_list)*100)):
                    total_stock_cost = buying_power * (cap_size_portfolio["small_cap"]/(len(small_cap_list)*100))
                stock["buy"] = round(total_stock_cost / stock["price"], 2)

        final_list = large_cap_list
        final_list.extend(medium_cap_list)
        final_list.extend(small_cap_list)

        final_list = [item for item in final_list if "buy" in item and item["buy"] > 0]

        if len(final_list) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)

        with connection.cursor() as cursor:
            # Update iterations
            sql_statement = f"""
                UPDATE suggestions_stocksuggestion
                SET iteration = iteration + 1
                WHERE user_id = %s
            """
            cursor.execute(sql_statement, [user.id])

            # Delete iterations
            sql_statement = f"""
                DELETE FROM suggestions_stocksuggestion
                WHERE user_id = %s and iteration = 3
            """
            cursor.execute(sql_statement, [user.id])

            # Create suggestion
            sql_statement = f"""
                INSERT INTO suggestions_stocksuggestion
                (user_id, stock_id, iteration, shares, price_per_share, creation_time)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            temp_list = [
                (user.id, stock['id'], 0, stock['buy'], stock['price'], 'now()')
                for stock in final_list
            ]
            cursor.executemany(sql_statement, temp_list)
        connection.commit()

        return Response(final_list)

    def get(self, request, format=None):
        user = request.user
        suggested_info = StockSuggestion.objects.raw(
            f"""
                SELECT * FROM suggestions_stocksuggestion
                WHERE user_id = %s
                ORDER BY creation_time DESC
            """,
            [user.id]
        )

        suggested_info = StockSuggestionSerializer(suggested_info, many=True).data

        return Response(suggested_info)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def user_select_suggestion(request):
    user = request.user
    data = request.data['stocks_list']

    total_purchase = [
        {
            'shares': item['buy'],
            'stock_id': item['id'],
            'total_value': item['price'] * item['buy']
        }
        for item in data
        if item['buy'] > 0
    ]

    with connection.cursor() as cursor:
        sql_query = f"""
            UPDATE stocks_userstocks
            SET shares = shares + %s
            WHERE user_id = %s AND stocks_id = %s
        """
        params = [(item['shares'], user.id, item['stock_id']) for item in total_purchase]
        cursor.executemany(sql_query, params)

        total_value = sum([item['total_value'] for item in total_purchase])
        current_cash = UserCashBalance.objects.raw(f"""
            SELECT * FROM users_usercashbalance
            WHERE user_id = %s
        """, [user.id])[0]
        current_cash = current_cash.current_cash_balance
        sql_query = f"""
            UPDATE users_usercashbalance
            SET current_cash_balance = %s
            WHERE user_id = %s
        """
        cursor.execute(sql_query, [round(current_cash - total_value, 2), user.id])
    connection.commit()

    return Response(total_purchase)