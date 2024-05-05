from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import connection

from .models import Stock, UserStocks


class StocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"


class ViewStocks(APIView):
    def get(self, request, format=None):
        stocks = Stock.objects.raw('SELECT * FROM stocks_stock')
        stocks = StocksSerializer(stocks, many=True).data

        return Response(stocks)


class UserStockSerializer(serializers.ModelSerializer):
    stocks = StocksSerializer()

    class Meta:
        model = UserStocks
        fields = ['stocks', 'shares']


class ViewUserStocks(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        stocks = UserStocks.objects.raw(f"""
            SELECT * FROM stocks_userstocks WHERE user_id = %s
        """, [user.id])   
        stocks = UserStockSerializer(stocks, many=True).data
        
        return Response(stocks)
    
    
    def post(self, request, format=None):
        data = request.data
        user = request.user

        sql_statement = f"""
            INSERT INTO stocks_userstocks (user_id, stocks_id, shares)
            VALUES (%s, %s, %s)
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_statement, [
                user.id,
                data['stocks_id'],
                data.get('shares', 0)
            ])
        connection.commit()
        
        return Response(status=status.HTTP_201_CREATED)
    
    
    def delete(self, request, format=None):
        data = request.GET
        user = request.user

        sql_statement = f"""
            DELETE FROM stocks_userstocks 
            WHERE user_id=%s AND stocks_id=%s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_statement, [user.id, data['stocks_id']])
        connection.commit()

        return Response(status=status.HTTP_204_NO_CONTENT)

    
    
