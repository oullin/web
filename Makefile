.PHONY: format format-check env-fresh lint-fix

SHELL := /bin/bash
ROOT_PATH := $(shell pwd)
OXFMT_EXCLUDES := '!**/.vite-build-check/**' '!dist/**' '!dist-plan/**' '!dist-verify/**'
OXLINT_EXCLUDES := --ignore-pattern dist/** --ignore-pattern dist-plan/** --ignore-pattern dist-verify/**

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
	pnpm exec oxfmt --write . $(OXFMT_EXCLUDES)
	make lint-fix

format-check:
	pnpm exec oxfmt . $(OXFMT_EXCLUDES)

env-fresh:
	rm -rf $(ROOT_PATH)/node_modules
	pnpm store prune
	pnpm install --frozen-lockfile

lint-fix:
	pnpm exec oxlint --fix $(OXLINT_EXCLUDES)
