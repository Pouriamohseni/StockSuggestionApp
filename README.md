# User Manual
___

## API Docs
[API docs here](https://github.com/Chango987/CS4347_Database_Project/blob/main/backend-api.md)
___
## BACKEND
### Setting up backend
On first time running the backend, you need to set up your python virtual environment
```bash
python3 -m venv venv
```

##### Installing new packages
```bash
pip install -r requirements.txt
```

### Running backend
```bash
cd backend
source venv/bin/activate
python3 manage.py runserver
```

*Note:* If you run into any *cannot find package* error, install the latest packages since another person might have added a package. See **Installing new packages**.

##### Admin dashboard
`localhost:8000/admin`
username: `admin@admin.admin`
password: `admin`

### Adding new module to backend
Create new app (module)
```bash
cd backend
python3 manage.py startapp [APP_NAME]
```

then in backend/settings.py, register our new module
```python
...

INSTALLED_APPS = [
    ...

    'APP_NAME'    #add new module here
]

...
```

### Modifying models
Modifying models requires migrating the change to database
```bash
python3 manage.py makemigrations
./migrateToDB.bash
```

`migrateToDB.bash` saves all changes to the DB tables/schemas to DB_SCHEMA_MODIFY.log

## FRONTEND
### Setting up
```bash
cd frontend
npm install
```

### Running
```bash
cd frontend
npm start
```

Project Images:

<img width="969" alt="Screenshot 2024-06-06 at 10 27 00 AM" src="https://github.com/Pouriamohseni/StockSuggestionApp/assets/145625808/aa52202d-3fba-4a94-aa40-fbaa1ed2ad3a">

<img width="969" alt="Screenshot 2024-06-06 at 10 27 47 AM" src="https://github.com/Pouriamohseni/StockSuggestionApp/assets/145625808/10151cef-4f50-456b-81f9-5b5ca8ca0879">

<img width="1059" alt="Screenshot 2024-06-11 at 10 49 29 AM" src="https://github.com/Pouriamohseni/StockSuggestionApp/assets/145625808/18de9b8b-7d47-4ac6-afb6-7466c528d9ac">

<img width="1059" alt="Screenshot 2024-06-11 at 10 50 09 AM" src="https://github.com/Pouriamohseni/StockSuggestionApp/assets/145625808/eccd98b7-69e5-4d74-8497-aaa786afa491">


