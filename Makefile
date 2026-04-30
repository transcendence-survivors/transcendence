DOCKER_MANAGER = docker compose

DEV_COMPOSE = docker-compose.dev.yml
PROD_COMPOSE = docker-compose.prod.yml


export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export DRI_PRIME=1 google-chrome

all: dev-d

dev:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up --build
	@echo "DEV ready 🚀"

dev-d:
	@echo "Starting DEV in background..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up -d --build

dev-stop:
	@echo "Stopping DEV environment..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) down


prod:
	@echo "Starting PROD environment with Docker..."
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) up --build -d

prod-stop:
	@echo "Stopping PROD environment..."
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) down

	


rebuild-dev:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up --build --force-recreate

rebuild-prod:
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) up --build --force-recreate -d




migrate-dev:
	@echo "Running Prisma migrations (DEV)..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec server pnpm prisma migrate dev


clean:
	@echo "Cleaning Docker system..."
	docker system prune -f

fclean:
	@echo "Full cleanup (containers + volumes)..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) down -v
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) down -v
	docker system prune -af --volumes



logs-dev:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) logs -f

logs-prod:
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) logs -f

.PHONY: all \
	dev dev-d dev-stop \
	prod prod-stop \
	rebuild-dev rebuild-prod \
	migrate-dev \
	clean fclean \
	logs-dev logs-prod