#!/bin/bash
# Render startup script

# Use PORT environment variable from Render, default to 8000
PORT=${PORT:-8000}

# Start uvicorn directly
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
