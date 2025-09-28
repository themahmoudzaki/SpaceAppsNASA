# --- Stage 1: "builder" ---
# Install Python dependencies needed to build the app
FROM python:3.11-slim as builder

RUN pip install --upgrade pip && apt-get install -y

# --- Set up Python enviroment ---
# Create a python selt contained enviroment
RUN python -m venv /opt/venv
# Prepend new path
ENV PATH="/opt/venv/bin:$PATH"
# Only "requirments.txt" is copied as to not cause a "cache miss" if 
# anything other than the libraries is changed
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

CMD ["python", "ml/src/main.py"]

# Copy virtual enviroment from builder
COPY --from=builder /opt/venv /opt/venv
# Prepend new path
ENV PATH="/opt/venv/bin:$PATH"

# --- Set working directory ---
WORKDIR /app
COPY . .
