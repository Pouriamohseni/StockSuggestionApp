# API endpoints

### /user/
Endpoint to create and sign in users

GET
```
params: {
    password,
    email
}
```

POST
```
data: {
    password,
    email,
    first_name,
    last_name,

}
```

### /stocks/
Endpoint to get all offered stocks

GET

### /user_stocks/
Endpoint to retrieve and modify user preferred stocks

GET: auth

POST: auth
```
data: {
    stocks_id,
    shares (optional)
}
```

DELETE: auth
```
param: {
    stocks_id
}
```

### /user_portfolio/
Endpoint to access and modify user portfolio spread

GET: auth

POST: auth
```
data: {
    small_cap_percentage,
    medium_cap_percentage,
    large_cap_percentage
}
```

PATCH: auth
```
data: {
    small_cap_percentage,
    medium_cap_percentage,
    large_cap_percentage
}
```

### /user_portfolio_actual/
GET: auth

### /stocks_suggestions/
Endpoint to get suggested stocks and history

GET: auth

POST: auth
```
data: {
    cap_size_portfolio: {
        large_cap,
        mid_cap,
        small_cap
    },
    buying_power,
}
```

### /user_cash_balance/
GET: auth
