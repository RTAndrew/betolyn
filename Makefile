.PHONY: help dev-mobile dev-backend dev-seed install-mobile install-backend clean reset-db db-reset

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

db-seed: ## Run the database seeder (requires backend on port 8080)
	@echo "Starting Database Seeder..."
	@cd $(CURDIR)/seed && node seed.js
	@echo "Database Seeder complete! "

db-reset: ## Reset the database (drop schema, recreate via Hibernate, run seed)
	@echo "Resetting database (kill 8080, run backend with profile reset, seed, kill 8080)..."
	@-lsof -ti:8080 | xargs kill 2>/dev/null || true
	@sleep 2
	@echo "Starting backend with profile reset (schema will be recreated)..."
	@cd backend && nohup ./mvnw spring-boot:run -Dspring-boot.run.profiles=reset > /tmp/betolyn-reset-backend.log 2>&1 &
	@echo "Waiting for backend on 8080 (up to 90s)..."
	@for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45; do \
		code=$$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ 2>/dev/null || echo "000"); \
		case "$$code" in 2??|4??|5??) echo "Backend up (HTTP $$code)."; break;; esac; \
		if [ $$i -eq 45 ]; then echo "Backend did not start in time. Check /tmp/betolyn-reset-backend.log"; exit 1; fi; \
		sleep 2; \
	done
	@echo "Running seed..."
	@$(MAKE) -C $(CURDIR) db-seed
	@echo "Stopping backend..."
	@-lsof -ti:8080 | xargs kill 2>/dev/null || true
	@echo "Reset complete. Next run: start backend without profile so ddl-auto stays create-only."
