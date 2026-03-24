
PACKAGE_MANAGER 	= pnpm
CMD_INSTALL 		= $(PACKAGE_MANAGER) install
CMD_RUN_DEV 		= $(PACKAGE_MANAGER) run dev
CMD_RUN_BUILD 		= $(PACKAGE_MANAGER) run build
CMD_RUN_CLEAN 		= $(PACKAGE_MANAGER) run clean

FRONTEND_DIR		= client
BACKEND_DIR 		= server
GAME_DIR 			= game

all: dev




dev:
	$(MAKE) -j2 dev-frontend dev-game

dev-frontend:
	@echo "Running frontend..."
	cd $(FRONTEND_DIR) && $(CMD_INSTALL) && $(CMD_RUN_DEV)

dev-backend:
	@echo "Running backend..."
	cd $(BACKEND_DIR) && $(CMD_INSTALL) && $(CMD_RUN_DEV)
dev-game:
	@echo "Running game..."
	cd $(GAME_DIR) && $(CMD_INSTALL) && $(CMD_RUN_DEV)


dev-stop:
	@echo "Stopping development servers..."
	# This is a simple way to stop the servers, but it may not be the most elegant solution.
	# You may want to consider using a process manager like pm2 or concurrently for better control.
	pkill -f "pnpm run dev"



build: build-frontend build-backend build-game

build-frontend:
	@echo "Building frontend..."
	cd $(FRONTEND_DIR) && $(PACKAGE_MANAGER) install && $(PACKAGE_MANAGER) run build

build-backend:
	@echo "Building backend..."
	cd $(BACKEND_DIR) && $(PACKAGE_MANAGER) install && $(PACKAGE_MANAGER) run build

build-game:
	@echo "Building game..."
	cd $(GAME_DIR) && $(PACKAGE_MANAGER) install && $(PACKAGE_MANAGER) run build





uninstall:
	@echo "Uninstalling dependencies..."
	cd $(FRONTEND_DIR) && $(PACKAGE_MANAGER) uninstall
	cd $(BACKEND_DIR) && $(PACKAGE_MANAGER) uninstall
	cd $(GAME_DIR) && $(PACKAGE_MANAGER) uninstall

clean: uninstall

fclean:
	@echo "Cleaning build artifacts..."
	cd $(FRONTEND_DIR) && $(PACKAGE_MANAGER) run clean
	cd $(BACKEND_DIR) && $(PACKAGE_MANAGER) run clean
	cd $(GAME_DIR) && $(PACKAGE_MANAGER) run clean



.PHONY: all 
.PHONY: dev dev-frontend dev-backend dev-game dev-stop
.PHONY: build build-frontend build-backend build-game 
.PHONY: uninstall clean fclean
