.PHONY: help dev-mobile dev-backend install-mobile install-backend clean reset-db

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-mobile: ## Start the Expo development server
	@echo "Starting Expo development server..."
	cd mobile && npm start

dev-backend: ## Start the Spring Boot development server
	@echo "Starting Spring Boot development server..."
	@if [ ! -f "backend/pom.xml" ]; then \
		echo "Error: backend/pom.xml not found. Please ensure the Spring Boot project is properly set up."; \
		exit 1; \
	fi
	cd backend && ./mvnw spring-boot:run

install-mobile: ## Install mobile app dependencies
	@echo "Installing mobile app dependencies..."
	cd mobile && npm install

install-backend: ## Install backend dependencies
	@echo "Installing backend dependencies..."
	@if [ ! -f "backend/pom.xml" ]; then \
		echo "Error: backend/pom.xml not found. Please ensure the Spring Boot project is properly set up."; \
		exit 1; \
	fi
	cd backend && ./mvnw clean install -DskipTests

clean: ## Clean build artifacts and dependencies
	@echo "Cleaning build artifacts..."
	cd mobile && rm -rf node_modules
	cd backend && ./mvnw clean && rm -rf target
	@echo "Clean complete. Run 'make install-mobile' and 'make install-backend' to reinstall dependencies."

setup: install-mobile install-backend ## Setup the entire project (install all dependencies)
	@echo "Project setup complete!"

dev: dev-mobile ## Alias for dev-mobile (default development command)

reset-db: ## Reset the database (drop all tables and recreate schema)
	@echo "Resetting database..."
	@echo "Note: Database reset functionality should be implemented via Spring Boot Flyway/Liquibase migrations or SQL scripts."
	@echo "Please check backend/src/main/resources/db/migration for migration scripts."
