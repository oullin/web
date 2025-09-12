.PHONY: caddy-gen-certs caddy-del-certs caddy-validate caddy-fresh caddy-restart

CADDY_MTLS_DIR := $(ROOT_PATH)/caddy/mtls

caddy-fresh:
	@echo " "
	@make caddy-del-certs
	@echo " "
	@make caddy-gen-certs

caddy-restart:
	docker compose up -d --force-recreate web_caddy_prod

caddy-validate:
	docker run --rm \
      -v "$(ROOT_PATH)/caddy/WebCaddyfile.internal:/etc/caddy/Caddyfile:ro" \
      -v "$(ROOT_PATH)/caddy/mtls:/etc/caddy/mtls:ro" \
      caddy:2.10.0 caddy validate --config /etc/caddy/Caddyfile

caddy-gen-certs:
	@set -euo pipefail; \
		WEB_MTLS="$(CADDY_MTLS_DIR)"; \
        API_MTLS="$(ENV_API_LOCAL_DIR)"; \
		printf "$(YELLOW)ℹ️  WEB_MTLS ... : $(NC)%s \n" "$$WEB_MTLS"; \
		printf "$(YELLOW)ℹ️  API_MTLS ... : $(NC)%s \n" "$$API_MTLS"; \
		printf "\n"; \
		[ -n "$$WEB_MTLS" ] || { printf "$(RED)❌ ERROR: CADDY_MTLS_DIR is empty\033[0m\n"; exit 1; }; \
		[ -n "$$API_MTLS" ] || { printf "$(RED)❌ ERROR: ENV_API_LOCAL_DIR is empty\033[0m\n"; exit 1; }; \
		mkdir -p "$$WEB_MTLS"; chmod 700 "$$WEB_MTLS"; \
		printf "$(YELLOW)📁 CA dir list:\033[0m\n"; ls -l "$$API_MTLS" || true; \
		MISSING=0; BLOCK=0; \
		printf "\n"; \
		for f in "$$API_MTLS/ca.pem" "$$API_MTLS/ca.key"; do \
		  if [ ! -f "$$f" ]; then printf "$(RED)❌ Missing CA file: %s\033[0m\n" "$$f"; MISSING=1; fi; \
		done; \
		for f in client.key client.pem client.csr client.srl; do \
		  if [ -d "$$WEB_MTLS/$$f" ]; then printf "$(RED)❌ %s exists and is a directory. Remove or rename it.\033[0m\n" "$$WEB_MTLS/$$f"; BLOCK=1; fi; \
		done; \
		if [ "$$MISSING" -ne 0 ]; then printf "$(WHITE)⏭️  Skipping client cert generation due to missing CA files.\033[0m\n"; exit 2; fi; \
		if [ "$$BLOCK"  -ne 0 ]; then printf "$(WHITE)⏭️  Skipping client cert generation because output paths conflict with directories.\033[0m\n"; exit 3; fi; \
		printf "$(YELLOW)🔐 Generating client key & CSR...\033[0m\n"; \
		umask 077; \
		openssl genrsa -out "$$WEB_MTLS/client.key" 4096; \
		openssl req -new -key "$$WEB_MTLS/client.key" -subj "/CN=web-caddy" -out "$$WEB_MTLS/client.csr"; \
		EXTFILE="$$(mktemp)"; trap 'rm -f "$$EXTFILE"' EXIT; printf "extendedKeyUsage=clientAuth\n" > "$$EXTFILE"; \
		printf "$(BLUE)🖊️  Signing client cert with CA...\033[0m\n"; \
		if [ -f "$$API_MTLS/ca.srl" ]; then \
		  openssl x509 -req -in "$$WEB_MTLS/client.csr" -CA "$$API_MTLS/ca.pem" -CAkey "$$API_MTLS/ca.key" -CAserial "$$API_MTLS/ca.srl" -out "$$WEB_MTLS/client.pem" -days 1095 -sha256 -extfile "$$EXTFILE"; \
		else \
		  printf "$(CYAN)ℹ️  No serial file found. Creating %s via -CAcreateserial\033[0m\n" "$$API_MTLS/ca.srl"; \
		  openssl x509 -req -in "$$WEB_MTLS/client.csr" -CA "$$API_MTLS/ca.pem" -CAkey "$$API_MTLS/ca.key" -CAserial "$$API_MTLS/ca.srl" -CAcreateserial -out "$$WEB_MTLS/client.pem" -days 1095 -sha256 -extfile "$$EXTFILE"; \
		fi; \
		chmod 600 "$$WEB_MTLS/client.key"; \
		chmod 644 "$$WEB_MTLS/client.pem"; \
		printf "\n"; \
		printf "$(CYAN)➕ Copying CA certificate for trust pool...\033[0m\n"; \
		cp "$$API_MTLS/ca.pem" "$$WEB_MTLS/ca.pem"; \
		printf "\n"; \
		printf "$(GREEN)✅ All certs generated at: \033[0m%s\n" "$$WEB_MTLS"; \
		printf "$(BLUE)🔎 Verifying client certificate against CA...\033[0m\n"; \
		openssl verify -CAfile "$$API_MTLS/ca.pem" "$$WEB_MTLS/client.pem"; \
		printf "\n"

caddy-del-certs:
	@set -eu; \
	WEB_MTLS="$(CADDY_MTLS_DIR)"; \
	if [ -d "$$WEB_MTLS" ]; then \
	  rm -rf "$$WEB_MTLS/client.key" "$$WEB_MTLS/client.pem" "$$WEB_MTLS/client.csr" "$$WEB_MTLS/client.srl" "$$WEB_MTLS/ca.pem"; \
	  printf "$(GREEN)✅ files removed from [$(NC)%s$(GREEN)]$(NC)\n" "$$WEB_MTLS"; \
	else \
	  printf "$(YELLOW)⚠️  %s does not exist$(NC)\n" "$$WEB_MTLS"; \
	fi
