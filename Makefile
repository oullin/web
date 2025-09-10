.PHONY: format env-fresh lint-fix
.PHONY: prod-up local-fresh local-up

SHELL := /bin/bash
ROOT_PATH := $(shell pwd)

BUILD_VERSION ?= latest
WEB_TAG ?= web-prod-builder
BUILD_PACKAGE_OWNER ?= oullin_web

NC     := \033[0m
BOLD   := \033[1m
CYAN   := \033[36m
WHITE  := \033[37m
GREEN  := \033[0;32m
BLUE   := \033[0;34m
RED    := \033[0;31m
YELLOW := \033[1;33m

format:
	npx prettier --write '**/*.{json,js,ts,tsx,jsx,mjs,cjs,vue,html}' --ignore-path .prettierignore
	make lint-fix

env-fresh:
	rm -rf $(ROOT_PATH)/node_modules
	rm $(ROOT_PATH)/package-lock.json
	npm cache clean --force
	npm install

lint-fix:
	npx eslint . --fix

# --- Build
build-ci:
	@printf "\n$(CYAN)Building production images for CI$(NC)\n"
	# This 'build' command only builds the images; it does not run them.
	@docker compose --profile prod build

build-release:
	@printf "\n$(YELLOW)Tagging images to be released.$(NC)\n"
	docker tag $(WEB_TAG) ghcr.io/$(BUILD_PACKAGE_OWNER)/oullin_web:$(BUILD_VERSION)

	@printf "\n$(GREEN)Pushing release to GitHub registry.$(NC)\n"
	docker push ghcr.io/$(BUILD_PACKAGE_OWNER)/oullin_web:$(BUILD_VERSION)

build-deploy:
	docker compose --env-file ./.env --profile prod up -d --no-build

local-fresh:
	docker compose --profile local down --volumes --rmi all --remove-orphans
	docker ps
	make local-up

local-up:
	docker compose --profile local build --no-cache
	docker compose --profile local up -d
