DOCKER_MANAGER = docker-compose

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
LOCAL_NETWORK_CLIENT_DIR = $(LOCAL_APP_DIR)/network/client
LOCAL_NETWORK_SERVER_DIR = $(LOCAL_APP_DIR)/network/server
LOCAL_GAME_CLIENT_DIR = $(LOCAL_APP_DIR)/game/client
LOCAL_GAME_SHARED_DIR = $(LOCAL_APP_DIR)/game/shared-package
LOCAL_GAME_SERVER_DIR = $(LOCAL_APP_DIR)/game/server

all: dev

dev:
	@echo "Starting DEV in background..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up -d --build
	sleep 5
	$(MAKE) dev-sync

dev-sync-network:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) cp $(NETWORK_SERVER_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/node_modules $(LOCAL_NETWORK_SERVER_DIR)
	$(DOCKER_MANAGER) -f  $(DEV_COMPOSE) cp $(NETWORK_CLIENT_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/node_modules $(LOCAL_NETWORK_CLIENT_DIR)

dev-sync-game:
	$(DOCKER_MANAGER) -f  $(DEV_COMPOSE) cp $(GAME_SERVER_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/server/node_modules $(LOCAL_GAME_SERVER_DIR)
	$(DOCKER_MANAGER) -f  $(DEV_COMPOSE) cp $(GAME_CLIENT_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/client/node_modules $(LOCAL_GAME_CLIENT_DIR)
	$(DOCKER_MANAGER) -f  $(DEV_COMPOSE) cp $(GAME_SERVER_CONTAINER):$(DOCKER_APP_NODE_MODULES_DIR)/server/node_modules $(LOCAL_GAME_SHARED_DIR)

dev-sync: dev-sync-network dev-sync-game


M_NAME :=

dev-migrate-deploy:
	@echo "Deploying Prisma migrations (DEV)..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm run migration:deploy
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm run migration:generate


dev-migrate:
	@if [ -z "$(M_NAME)" ]; then \
		echo "Error: M_NAME variable is not set. Please provide a migration name."; \
		exit 1; \
	fi
	@echo "Running Prisma migrations (DEV)..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm run migration:create $(M_NAME)
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm run migration:generate
	$(MAKE) dev-migrate-deploy

dev-network:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up $(NETWORK_SERVER_CONTAINER) $(NETWORK_CLIENT_CONTAINER) -d --build
	sleep 5
	$(MAKE) dev-sync-network
	$(MAKE) dev-migrate-deploy

dev-game:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up $(GAME_SERVER_CONTAINER) $(GAME_CLIENT_CONTAINER) -d --build
	sleep 5
	$(MAKE) dev-sync-game

dev-stop:
	@echo "Stopping DEV environment..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) down

dev-clean: dev-stop

dev-fclean:
	@echo "Cleaning DEV environment (containers + volumes)..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) down -v
	docker system prune -af --volumes

dev-re: dev-fclean dev


.PHONY: dev dev-sync dev-sync-network dev-sync-game \
	dev-migrate-deploy dev-migrate \
	dev-network dev-game wasm \
	dev-stop dev-clean dev-fclean dev-re






prod:
	@echo "Starting PROD environment with Docker..."
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) up --build -d

prod-stop:
	@echo "Stopping PROD environment..."
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) down

rebuild-prod:
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) up --build --force-recreate -d


studio:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm run migration:studio


.PHONY: prod prod-stop rebuild-prod migrate-dev studio

clean:
	@echo "Cleaning Docker system..."
	docker system prune -f

fclean: dev-fclean
	rm -rf $(LOCAL_NETWORK_CLIENT_DIR)/node_modules
	rm -rf $(LOCAL_NETWORK_CLIENT_DIR)/dist
	rm -rf $(LOCAL_NETWORK_CLIENT_DIR)/.next	

	rm -rf $(LOCAL_NETWORK_SERVER_DIR)/node_modules
	rm -rf $(LOCAL_NETWORK_SERVER_DIR)/prisma/generated
	rm -rf $(LOCAL_NETWORK_SERVER_DIR)/dist

	rm -rf $(LOCAL_GAME_CLIENT_DIR)/node_modules
	rm -rf $(LOCAL_GAME_SERVER_DIR)/node_modules
	rm -rf $(LOCAL_GAME_SHARED_DIR)/node_modules

logs-dev:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) logs -f

logs-prod:
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) logs -f

.PHONY: all \
	clean fclean \
	logs-dev logs-prod


seed:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm prisma db seed

.PHONY: seed
