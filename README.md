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
