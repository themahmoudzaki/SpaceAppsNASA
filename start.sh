#!/bin/sh
set -e

echo "Running migrations..."
python /app/django_backend/manage.py migrate --noinput

echo "Starting Django..."
python /app/django_backend/manage.py runserver 0.0.0.0:8000
