"""
Development Server Runner
Quick start script for running the FastAPI application
"""

import uvicorn
from app.config import settings
import os

if __name__ == "__main__":
    # Get port from environment variable (Render sets this)
    port = int(os.getenv("PORT", settings.PORT))
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Must bind to 0.0.0.0 for Render
        port=port,
        reload=False,  # Disable reload in production
        log_level="info",
    )
