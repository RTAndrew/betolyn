# Backend Service

This is a FastAPI backend service for the React Native Example app.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/version` - API version information

## Development

The server will automatically reload when you make changes to the code.

## Production

For production deployment, use a production ASGI server like Gunicorn:

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```
