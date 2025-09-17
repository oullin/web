.PHONY: build-ci build-deploy build-release local-fresh local-up build-remove

WEB_TAG ?= web-prod-builder
BUILD_VERSION ?= latest
BUILD_PACKAGE_OWNER ?= oullin_web

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
local-fresh:
	docker compose --profile local down --volumes --rmi all --remove-orphans
	docker ps
	make local-up

local-up:
	docker compose --profile local build --no-cache
	docker compose --profile local up -d
