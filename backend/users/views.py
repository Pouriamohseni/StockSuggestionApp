# from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import authentication, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.db import connection
from rest_framework.decorators import api_view, permission_classes

from .models import User, UserPortfolio, UserCashBalance

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            # "id",
            "email",
            "first_name",
            "last_name"
        ]

class ViewUsers(APIView):
    # retrieve access token to make authorized api calls
    def get(self, request, format=None):
        data = request.GET
        user = User.objects.raw('SELECT * FROM users_user WHERE email = %s', [data['email']])[0]

        if not check_password(data['password'], user.password):
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # generate access token
        refresh_token = RefreshToken.for_user(user)
        user = UsersSerializer(user).data
        user['access_token'] = str(refresh_token.access_token)

        return Response(user)
    

    def post(self, request, format=None):
        data = request.data
        email = data['email']
        first_name = data['first_name']
        last_name = data['last_name']
        password = make_password(data['password'])
        
        sql_statement = f"""
            insert into users_user (
                email,
                password,
                first_name,
                last_name,
                date_joined,
                is_staff,
                is_active,
                is_superuser,
                id
            )
            values
                (%s, %s, %s, %s, now(), false, true, false, gen_random_uuid())
        """

        with connection.cursor() as cursor:
            cursor.execute(sql_statement, [email, password, first_name, last_name])
        connection.commit()

        uuid = User.objects.get(email=email).id
        print(uuid)

        sql_statement = """
            insert into users_userportfolio (
                small_cap_percentage,
                medium_cap_percentage,
                large_cap_percentage,
                user_id
            )
            values
                (33.33, 33.33, 33.33, %s)
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_statement, [uuid])
        connection.commit()

        sql_statement = """
            insert into users_usercashbalance (
                current_cash_balance,
                proj_1year_balance,
                proj_5year_balance,
                user_id
            )
            values
                (0, 0, 0, %s)
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_statement, [uuid])
        connection.commit()

        return Response(status=status.HTTP_201_CREATED)


@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def user_edit_profile(request):
    user = request.user
    data = request.data

    email = data['email']
    first_name = data['first_name']
    last_name = data['last_name']
    password = make_password(data['password'])

    sql_statement = f"""
        UPDATE users_user 
        SET email = %s,
            first_name = %s,
            last_name = %s,
            password = %s
        WHERE id = %s
    """
    
    with connection.cursor() as cursor:
        cursor.execute(sql_statement, [email, first_name, last_name, password, user.id])

    return Response(status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def user_get_profile(request):
    user = request.user
    sql_statement = f"""
        SELECT *
        FROM users_user
        WHERE id = %s
    """

    user_obj = User.objects.raw(sql_statement, [user.id])[0]
    user_obj = UsersSerializer(user_obj).data
    
    return Response(user_obj)

class UserPortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPortfolio
        fields = [
            "small_cap_percentage",
            "medium_cap_percentage",
            "large_cap_percentage"
        ]


class ViewUserPortfolio(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        portfolio = UserPortfolio.objects.raw("SELECT * FROM users_userportfolio WHERE user_id = %s", [user.id])[0]
        portfolio = UserPortfolioSerializer(portfolio).data

        return Response(portfolio)
    

    def post(self, request, format=None):
        user = request.user
        data = request.data

        small_cap_percentage = data['small_cap_percentage']
        medium_cap_percentage = data['medium_cap_percentage']
        large_cap_percentage = data['large_cap_percentage']
 
        sql_statement = f"""
            insert into users_userportfolio (
                user_id,
                small_cap_percentage,
                medium_cap_percentage,
                large_cap_percentage
            )
            values
                (%s, %s, %s, %s)
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_statement, [user.id, small_cap_percentage, medium_cap_percentage, large_cap_percentage])

        return Response(status=status.HTTP_201_CREATED)


    def patch(self, request, format=None):
        user = request.user
        data = request.data

        small_cap_percentage = data['small_cap_percentage']
        medium_cap_percentage = data['medium_cap_percentage']
        large_cap_percentage = data['large_cap_percentage']

        sql_statement = f"""
            UPDATE users_userportfolio 
            SET small_cap_percentage = %s,
                medium_cap_percentage = %s,
                large_cap_percentage = %s
            WHERE user_id = %s
        """
        
        with connection.cursor() as cursor:
            cursor.execute(sql_statement, [small_cap_percentage, medium_cap_percentage, large_cap_percentage, user.id])

        return Response(status=status.HTTP_200_OK)
    

class UserCashBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCashBalance
        fields = [
            "current_cash_balance",
            "proj_1year_balance",
            "proj_5year_balance"
        ] 


class ViewUserCashBalance(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        user = request.user
        cash_balance = UserCashBalance.objects.raw("SELECT * FROM users_usercashbalance WHERE user_id = %s", [user.id])[0]
        cash_balance = UserCashBalanceSerializer(cash_balance).data

        return Response(cash_balance)
    
    def put(self, request, format=None):
        user = request.user
        data = request.data

        current_cash_balance = data["current_cash_balance"]

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM users_usercashbalance WHERE user_id = %s",
                [user.id]
            )
            result = cursor.fetchone()[0]

            if result > 0:
                sql_statement = f"""
                    UPDATE users_usercashbalance
                    SET current_cash_balance = %s
                    WHERE user_id = %s
                """
                cursor.execute(sql_statement,[current_cash_balance, user.id])
                connection.commit()
                return Response(status=status.HTTP_204_NO_CONTENT)

            else:
                sql_statement = f"""
                    INSERT into users_usercashbalance (
                        user_id,
                        current_cash_balance,
                        proj_1year_balance,
                        proj_5year_balance
                    )
                    values
                        (%s, %s, %s, %s)
                """
                cursor.execute(sql_statement,[
                    user.id,
                    current_cash_balance,
                    current_cash_balance,
                    current_cash_balance
                ])
                connection.commit()
                return Response(status=status.HTTP_201_CREATED)
