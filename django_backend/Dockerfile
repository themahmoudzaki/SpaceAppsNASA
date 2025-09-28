# Use a specific Python version for reproducibility
FROM python:3.13-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# System deps (keep minimal; most wheels install without extra build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first to leverage Docker layer caching
COPY req.txt /app/req.txt
RUN pip install --no-cache-dir -r req.txt

# Copy project files
COPY . /app

# Set Django settings module (adjust if your settings module/path differs)
ENV DJANGO_SETTINGS_MODULE=ExoXHunter.settings

# Collect static files during build so they're included in the image
# This assumes STATIC_ROOT is configured in your settings
RUN python manage.py collectstatic --noinput

# Expose port for Django runserver
EXPOSE 8000

# Default command: Django development server (suitable for dev)
# For production, consider installing gunicorn and using:
#   CMD ["gunicorn", "ExoXHunter.wsgi:application", "--bind", "0.0.0.0:8000"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]