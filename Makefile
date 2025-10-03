.PHONY: format env-fresh lint-fix

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

include $(ROOT_PATH)/build/makefiles/caddy.mk
include $(ROOT_PATH)/build/makefiles/build.mk

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
	if node -e "require.resolve('eslint')" >/dev/null 2>&1 \
		&& node -e "require.resolve('@typescript-eslint/parser')" >/dev/null 2>&1 \
		&& node -e "require.resolve('@typescript-eslint/eslint-plugin')" >/dev/null 2>&1 \
		&& node -e "require.resolve('eslint-plugin-vue')" >/dev/null 2>&1 \
		&& node -e "require.resolve('@babel/eslint-parser')" >/dev/null 2>&1 \
		&& node -e "require.resolve('eslint-config-prettier')" >/dev/null 2>&1 \
		&& node -e "require.resolve('vue-eslint-parser')" >/dev/null 2>&1; then \
		npx eslint . --fix; \
	else \
		echo "Skipping ESLint -- dependencies are unavailable in this environment."; \
	fi
