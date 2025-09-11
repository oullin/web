.PHONY: build-ci build-deploy build-release

WEB_TAG ?= web-prod-builder
BUILD_VERSION ?= latest
BUILD_PACKAGE_OWNER ?= oullin_web

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
