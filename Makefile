.PHONY: help dev-mobile dev-backend install-mobile install-backend clean reset-db

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-mobile: ## Start the Expo development server
	@echo "Starting Expo development server..."
	cd mobile && npm start

dev-backend: ## Start the FastAPI development server
	@echo "Starting FastAPI development server..."
	@if [ ! -d "backend" ]; then \
		echo "Backend directory does not exist. Creating basic FastAPI structure..."; \
		mkdir -p backend; \
		echo 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"Hello": "World"}' > backend/main.py; \
		echo 'fastapi\nuvicorn[standard]' > backend/requirements.txt; \
	fi
	@if [ ! -d "backend/.venv" ]; then \
		echo "Creating Python virtual environment..."; \
		cd backend && python3 -m venv .venv; \
	fi
	cd backend && source .venv/bin/activate && PYTHONDONTWRITEBYTECODE=1 uvicorn main:app --reload --host 0.0.0.0 --port 8000

install-mobile: ## Install mobile app dependencies
	@echo "Installing mobile app dependencies..."
	cd mobile && npm install

install-backend: ## Install backend dependencies
	@echo "Installing backend dependencies..."
	@if [ ! -d "backend" ]; then \
		echo "Backend directory does not exist. Creating basic FastAPI structure..."; \
		mkdir -p backend; \
		echo 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"Hello": "World"}' > backend/main.py; \
		echo 'fastapi\nuvicorn[standard]' > backend/requirements.txt; \
	fi
	@if [ ! -d "backend/.venv" ]; then \
		echo "Creating Python virtual environment..."; \
		cd backend && python3 -m venv .venv; \
	fi

	cd backend && source .venv/bin/activate && pip install -r requirements.txt

clean: ## Clean build artifacts and dependencies
	@echo "Cleaning build artifacts..."
	cd mobile && rm -rf node_modules
	cd backend && rm -rf __pycache__ *.pyc
	@echo "Clean complete. Run 'make install-mobile' and 'make install-backend' to reinstall dependencies."

setup: install-mobile install-backend ## Setup the entire project (install all dependencies)
	@echo "Project setup complete!"

dev: dev-mobile ## Alias for dev-mobile (default development command)

reset-db: ## Reset the database (drop all tables and recreate schema)
	@echo "Resetting database..."
	cd backend && python reset_db.py
