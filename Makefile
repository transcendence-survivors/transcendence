DOCKER_MANAGER = docker compose

DEV_COMPOSE = docker-compose.dev.yml
PROD_COMPOSE = docker-compose.prod.yml

NETWORK_SERVER_CONTAINER = network-server
NETWORK_CLIENT_CONTAINER = network-client
GAME_SERVER_CONTAINER = game-server
GAME_CLIENT_CONTAINER = game-client

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export DRI_PRIME=1 google-chrome

DOCKER_APP_NODE_MODULES_DIR = /app

LOCAL_APP_DIR = ./apps
LOCAL_NETWORK_CLIENT_NODE_MODULES = $(LOCAL_APP_DIR)/network/client
LOCAL_NETWORK_SERVER_NODE_MODULES = $(LOCAL_APP_DIR)/network/server
LOCAL_GAME_CLIENT_NODE_MODULES = $(LOCAL_APP_DIR)/game/client
LOCAL_GAME_SERVER_NODE_MODULES = $(LOCAL_APP_DIR)/game/server

all: dev-sync

dev:
	@echo "Starting DEV in background..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up -d --build

dev-wait:
	@echo "Waiting for containers to be ready..."
	@until docker inspect -f '{{.State.Running}}' $(NETWORK_SERVER_CONTAINER) 2>/dev/null | grep -q true; do sleep 1; done
	@until docker inspect -f '{{.State.Running}}' $(NETWORK_CLIENT_CONTAINER) 2>/dev/null | grep -q true; do sleep 1; done
	@until docker inspect -f '{{.State.Running}}' $(GAME_SERVER_CONTAINER) 2>/dev/null | grep -q true; do sleep 1; done
	@until docker inspect -f '{{.State.Running}}' $(GAME_CLIENT_CONTAINER) 2>/dev/null | grep -q true; do sleep 1; done
	@echo "All containers running."

dev-sync-modules:
	sleep 5
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) cp $(NETWORK_SERVER_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/node_modules $(LOCAL_NETWORK_SERVER_NODE_MODULES)
	$(DOCKER_MANAGER) -f  $(DEV_COMPOSE) cp $(NETWORK_CLIENT_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/node_modules $(LOCAL_NETWORK_CLIENT_NODE_MODULES)
	$(DOCKER_MANAGER) -f  $(DEV_COMPOSE) cp $(GAME_SERVER_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/server/node_modules $(LOCAL_GAME_SERVER_NODE_MODULES)
	$(DOCKER_MANAGER) -f  $(DEV_COMPOSE) cp $(GAME_CLIENT_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/client/node_modules $(LOCAL_GAME_CLIENT_NODE_MODULES)

dev-sync: dev dev-sync-modules

M_NAME :=

dev-migrate:
	@if [ -z "$(M_NAME)" ]; then \
		echo "Error: M_NAME variable is not set. Please provide a migration name."; \
		exit 1; \
	fi
	@echo "Running Prisma migrations (DEV)..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm run migration:create $(M_NAME)
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm run migration:generate

dev-network:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up $(NETWORK_SERVER_CONTAINER) $(NETWORK_CLIENT_CONTAINER) -d --build

dev-game:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up $(GAME_SERVER_CONTAINER) $(GAME_CLIENT_CONTAINER) -d --build

dev-stop:
	@echo "Stopping DEV environment..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) down

dev-clean: dev-stop

dev-fclean:
	@echo "Cleaning DEV environment (containers + volumes)..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) down -v
	docker system prune -af --volumes

dev-re: dev-fclean dev


.PHONY: dev dev-sync dev-migrate dev-network dev-game dev-stop dev-clean dev-fclean dev-re





prod:
	@echo "Starting PROD environment with Docker..."
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) up --build -d

prod-stop:
	@echo "Stopping PROD environment..."
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) down

rebuild-prod:
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) up --build --force-recreate -d





.PHONY: prod prod-stop rebuild-prod migrate-dev

clean:
	@echo "Cleaning Docker system..."
	docker system prune -f

fclean: dev-fclean

logs-dev:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) logs -f

logs-prod:
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) logs -f

.PHONY: all \
	clean fclean \
	logs-dev logs-prod