.PHONY: format env-fresh lint-fix
.PHONY: prod-fresh prod-up local-fresh local-up

SHELL := /bin/bash
ROOT_PATH := $(shell pwd)

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
prod-fresh:
	docker compose --profile prod down --volumes --rmi all --remove-orphans
	docker ps
	make prod-up

prod-up:
	docker compose --profile prod build --no-cache
	docker compose --profile prod up -d

local-fresh:
	docker compose --profile local down --volumes --rmi all --remove-orphans
	docker ps
	make local-up

local-up:
	docker compose --profile local build --no-cache
	docker compose --profile local up -d
