# React Native Example Monorepo

This is a monorepo containing a React Native Expo mobile application and a backend service.

## Project Structure

```
/
├── mobile/          # React Native Expo application
├── backend/         # Backend service (FastAPI)
├── README.md        # This file
├── .gitignore       # Root gitignore
└── Makefile         # Build and development scripts
```

## Getting Started

### Prerequisites

- Node.js (for mobile app)
- Python 3.8+ (for backend)
- Expo CLI
- FastAPI (for backend)

### Development

#### Mobile App
```bash
make dev-mobile
# or
cd mobile && npm start
```

#### Backend
```bash
make dev-backend
# or
cd backend && uvicorn main:app --reload
```

## Available Commands

- `make dev-mobile` - Start the Expo development server
- `make dev-backend` - Start the FastAPI development server
- `make install-mobile` - Install mobile app dependencies
- `make install-backend` - Install backend dependencies

## Contributing

Each project maintains its own dependencies and configuration. Changes to the mobile app should be made in the `mobile/` directory, and backend changes in the `backend/` directory.
