#!/bin/bash

python3 manage.py migrate
grep -i -E "TABLE|COLUMN|ALTER|MODIFY|RENAME|PRIMARY KEY|FOREIGN KEY|DROP" sql.log >> DB_SCHEMA_MODIFY.log 
awk '!seen[$0]++' DB_SCHEMA_MODIFY.log > temp.log && mv temp.log DB_SCHEMA_MODIFY.log
