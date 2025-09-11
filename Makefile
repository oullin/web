.PHONY: format env-fresh lint-fix local-fresh local-up

SHELL := /bin/bash
ROOT_PATH := $(shell pwd)

-include $(ROOT_PATH)/.env

NC     := \033[0m
BOLD   := \033[1m
CYAN   := \033[36m
WHITE  := \033[37m
GREEN  := \033[0;32m
BLUE   := \033[0;34m
RED    := \033[0;31m
YELLOW := \033[1;33m

include ./build/makefiles/caddy.mk
include ./build/makefiles/build.mk

# ---------

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

local-fresh:
	docker compose --profile local down --volumes --rmi all --remove-orphans
	docker ps
	make local-up

local-up:
	docker compose --profile local build --no-cache
	docker compose --profile local up -d
