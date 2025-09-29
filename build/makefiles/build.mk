.PHONY: build-ci build-deploy build-release build-remove
.PHONy: local-build local-watch

BUILD_VERSION ?= latest
WEB_TAG ?= web-prod-builder
BUILD_PACKAGE_OWNER ?= oullin_web

BUILD_UID ?= $(shell id -u)
BUILD_GID ?= $(shell id -g)

build-ci:
	@printf "\n$(CYAN)Building production images for CI$(NC)\n"
	@docker compose --profile prod build

build-release:
	@printf "\n$(YELLOW)Tagging images to be released.$(NC)\n"
	docker tag $(WEB_TAG) ghcr.io/$(BUILD_PACKAGE_OWNER)/oullin_web:$(BUILD_VERSION)
	@printf "\n$(GREEN)Pushing release to GitHub registry.$(NC)\n"
	docker push ghcr.io/$(BUILD_PACKAGE_OWNER)/oullin_web:$(BUILD_VERSION)

build-deploy:
	docker compose --env-file ./.env --profile prod up -d --no-build

build-remove:
	docker compose --profile prod down --volumes --rmi all --remove-orphans

# ----- LOCAL -----
local-build:
	docker compose --profile local down --volumes --rmi all --remove-orphans
	docker compose --profile local build --no-cache
	docker compose --profile local up -d --force-recreate --no-deps

local-watch:
	@printf "\n$(YELLOW)Using UID=$(BUILD_UID) GID=$(BUILD_GID).$(NC)\n"
	UID=$(BUILD_UID) GID=$(BUILD_GID) docker compose --profile local down --volumes --rmi all --remove-orphans
	UID=$(BUILD_UID) GID=$(BUILD_GID) docker compose --profile local build --no-cache
	UID=$(BUILD_UID) GID=$(BUILD_GID) docker compose --profile local up caddy-watcher caddy-local
