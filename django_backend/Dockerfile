# --- Stage 1: "builder" ---
FROM python:3.11-slim as builder

# Install system packages needed to build Python native extensions
# (build-essential, gcc) and libgomp so built wheels link correctly.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      gcc \
      g++ \
      libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Create and use a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy only requirements first to leverage Docker cache
COPY req.txt /tmp/req.txt

# Upgrade pip and install Python deps (will use compilers above if needed)
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /tmp/req.txt

# --- Stage 2: "production" ---
FROM python:3.11-slim as production

# Install runtime dependencies (only libgomp is required at runtime for LightGBM)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy virtualenv from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
