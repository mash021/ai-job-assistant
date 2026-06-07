# ---- Backend image: FastAPI served by Uvicorn ----
# A small, official Python base keeps the image lightweight.
FROM python:3.11-slim

# Prevent Python from writing .pyc files and force stdout/stderr to be
# unbuffered so logs show up immediately in `docker-compose` output.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# All app files live under /app inside the container.
WORKDIR /app

# Install dependencies first (separate layer) so Docker can cache them and
# avoid reinstalling on every code change.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code.
COPY . .

# The API listens on port 8000 inside the container.
EXPOSE 8000

# Start the FastAPI app. `--host 0.0.0.0` makes it reachable from outside the
# container; `--reload` gives a smooth local dev experience on code changes.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
