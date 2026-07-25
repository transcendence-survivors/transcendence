DOCKER_MANAGER = docker compose

DEV_COMPOSE = docker-compose.dev.yml
PROD_COMPOSE = docker-compose.prod.yml

NETWORK_SERVER_CONTAINER = network-server
NETWORK_CLIENT_CONTAINER = network-client
GAME_SERVER_CONTAINER = game-server

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export DRI_PRIME=1 google-chrome

LOCAL_ROOT_DIR = .
LOCAL_APP_DIR = ./apps
LOCAL_NETWORK_CLIENT_DIR = $(LOCAL_APP_DIR)/network/client
LOCAL_NETWORK_SERVER_DIR = $(LOCAL_APP_DIR)/network/server
LOCAL_GAME_UI_DIR = $(LOCAL_APP_DIR)/game/ui
LOCAL_GAME_SHARED_DIR = $(LOCAL_APP_DIR)/game/shared-package
LOCAL_GAME_SERVER_DIR = $(LOCAL_APP_DIR)/game/server
GAME_SERVER_IMAGE = repo-game-server

DOCKER_ROOT = /app
DOCKER_CLIENT = /app/apps/network/client
DOCKER_GAME_UI = /app/apps/game/ui
DOCKER_GAME_SHARED = /app/apps/game/shared-package
DOCKER_GAME_SERVER = /app/apps/game/server

all: dev

dev:
	@echo "Starting DEV in background...z"
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) up -d --build
	sleep 5
	$(MAKE) dev-migrate-deploy
	$(MAKE) dev-sync


dev-sync:
	@echo "Syncing node_modules for IDE..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) cp $(NETWORK_CLIENT_CONTAINER):$(DOCKER_ROOT)/node_modules $(LOCAL_ROOT_DIR)
	@$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec -T $(NETWORK_CLIENT_CONTAINER) tar -cf - -C $(DOCKER_CLIENT) node_modules | tar -xf - -C $(LOCAL_NETWORK_CLIENT_DIR)
	@$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec -T $(NETWORK_CLIENT_CONTAINER) tar -cf - -C $(DOCKER_GAME_UI) node_modules | tar -xf - -C $(LOCAL_GAME_UI_DIR)
	@$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec -T $(NETWORK_CLIENT_CONTAINER) tar -cf - -C $(DOCKER_GAME_SHARED) node_modules | tar -xf - -C $(LOCAL_GAME_SHARED_DIR)
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) cp $(NETWORK_SERVER_CONTAINER):$(DOCKER_ROOT)/node_modules $(LOCAL_NETWORK_SERVER_DIR)

	@docker run --rm $(GAME_SERVER_IMAGE) tar -cf - -C $(DOCKER_ROOT) node_modules | tar -xf - -C $(LOCAL_ROOT_DIR)
	@docker run --rm $(GAME_SERVER_IMAGE) tar -cf - -C $(DOCKER_GAME_SERVER) node_modules | tar -xf - -C $(LOCAL_GAME_SERVER_DIR)
	@echo "Sync done."


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

dev-stop:
	@echo "Stopping DEV environment..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) down

dev-clean:
	rm -rf $(LOCAL_ROOT_DIR)/node_modules

	rm -rf $(LOCAL_NETWORK_CLIENT_DIR)/node_modules
	rm -rf $(LOCAL_NETWORK_CLIENT_DIR)/dist
	rm -rf $(LOCAL_NETWORK_CLIENT_DIR)/.next

	rm -rf $(LOCAL_NETWORK_SERVER_DIR)/node_modules
	rm -rf $(LOCAL_NETWORK_SERVER_DIR)/prisma/generated
	rm -rf $(LOCAL_NETWORK_SERVER_DIR)/dist

	rm -rf $(LOCAL_GAME_UI_DIR)/node_modules
	rm -rf $(LOCAL_GAME_SERVER_DIR)/node_modules
	rm -rf $(LOCAL_GAME_SHARED_DIR)/node_modules

dev-fclean: dev-clean
	@echo "Cleaning DEV environment (containers + volumes)..."
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) down -v
	docker system prune -af --volumes

dev-re: dev-fclean dev

.PHONY: dev dev-sync \
	dev-migrate-deploy dev-migrate \
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

.PHONY: prod prod-stop rebuild-prod studio

clean:
	@echo "Cleaning Docker system..."
	docker system prune -f

fclean: dev-fclean

logs-dev:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) logs -f

logs-prod:
	$(DOCKER_MANAGER) -f $(PROD_COMPOSE) logs -f

.PHONY: all clean fclean logs-dev logs-prod


seed:
	$(DOCKER_MANAGER) -f $(DEV_COMPOSE) exec $(NETWORK_SERVER_CONTAINER) pnpm prisma db seed

.PHONY: seed