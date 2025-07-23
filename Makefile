.PHONY: format env-fresh lint-fix
.PHONY: build-fresh local-up local-down

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

build-fresh:
	docker compose down --remove-orphans && \
	docker container prune -f && \
	docker image prune -f && \
	docker volume prune -f && \
	docker network prune -f && \
	docker system prune -a --volumes -f && \
	docker ps -aq | xargs --no-run-if-empty docker stop && \
	docker ps -aq | xargs --no-run-if-empty docker rm && \
	docker ps

local-up:
	docker compose --profile local up --build -d

local-down:
	docker compose --profile local down
