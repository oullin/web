.PHONY: caddy-gen-certs caddy-del-certs caddy-validate

CADDY_MTLS_DIR := $(ROOT_PATH)/caddy/mtls

caddy-gen-certs:
	@set -euo pipefail; \
	WEB_MTLS="$(CADDY_MTLS_DIR)"; \
	API_MTLS="$(ENV_API_LOCAL_DIR)"; \
	printf "$(YELLOW)ℹ️  WEB_MTLS   : $(NC)%s\n" "$$WEB_MTLS"; \
	printf "$(YELLOW)ℹ️  API_MTLS   : $(NC)%s\n" "$$API_MTLS"; \
	[ -n "$$WEB_MTLS" ] || { printf "$(RED)❌ ERROR: CADDY_MTLS_DIR is empty$(NC)\n"; exit 1; }; \
	[ -n "$$API_MTLS" ] || { printf "$(RED)❌ ERROR: ENV_API_LOCAL_DIR is empty$(NC)\n"; exit 1; }; \
	mkdir -p "$$WEB_MTLS"; chmod 700 "$$WEB_MTLS"; \
	printf "$(YELLOW)📁 CA dir list:$(NC)\n"; ls -l "$$API_MTLS" || true; \
	MISSING=0; BLOCK=0; \
	for f in "$$API_MTLS/ca.pem" "$$API_MTLS/ca.key"; do \
	  if [ ! -f "$$f" ]; then printf "$(RED)❌ Missing CA file: %s$(NC)\n" "$$f"; MISSING=1; fi; \
	done; \
	for f in client.key client.pem client.csr client.srl; do \
	  if [ -d "$$WEB_MTLS/$$f" ]; then printf "$(RED)❌ %s exists and is a directory. Remove or rename it.$(NC)\n" "$$WEB_MTLS/$$f"; BLOCK=1; fi; \
	done; \
	if [ "$$MISSING" -ne 0 ]; then printf "$(RED)⏭️  Skipping client cert generation due to missing CA files.$(NC)\n"; exit 2; fi; \
	if [ "$$BLOCK"  -ne 0 ]; then printf "$(RED)⏭️  Skipping client cert generation because output paths conflict with directories.$(NC)\n"; exit 3; fi; \
	printf "$(GREEN)🔐 Generating client key & CSR...$(NC)\n"; \
	umask 077; \
	openssl genrsa -out "$$WEB_MTLS/client.key" 4096; \
	openssl req -new -key "$$WEB_MTLS/client.key" -subj "/CN=web-caddy" -out "$$WEB_MTLS/client.csr"; \
	EXTFILE="$$(mktemp)"; trap 'rm -f "$$EXTFILE"' EXIT; printf "extendedKeyUsage=clientAuth\n" > "$$EXTFILE"; \
	printf "$(YELLOW)🖊️  Signing client cert with CA...$(NC)\n"; \
	if [ -f "$$API_MTLS/ca.srl" ]; then \
	  openssl x509 -req -in "$$WEB_MTLS/client.csr" -CA "$$API_MTLS/ca.pem" -CAkey "$$API_MTLS/ca.key" -CAserial "$$API_MTLS/ca.srl" -out "$$WEB_MTLS/client.pem" -days 1095 -sha256 -extfile "$$EXTFILE"; \
	else \
	  printf "$(YELLOW)ℹ️  No serial file found. Creating %s via -CAcreateserial$(NC)\n" "$$API_MTLS/ca.srl"; \
	  openssl x509 -req -in "$$WEB_MTLS/client.csr" -CA "$$API_MTLS/ca.pem" -CAkey "$$API_MTLS/ca.key" -CAserial "$$API_MTLS/ca.srl" -CAcreateserial -out "$$WEB_MTLS/client.pem" -days 1095 -sha256 -extfile "$$EXTFILE"; \
	fi; \
	chmod 600 "$$WEB_MTLS/client.key"; \
	chmod 644 "$$WEB_MTLS/client.pem"; \
	SER="$$(openssl x509 -in "$$WEB_MTLS/client.pem" -noout -serial | sed 's/^serial=//')"; \
	printf "%s\n" "$$SER" > "$$WEB_MTLS/client.srl"; \
	chmod 644 "$$WEB_MTLS/client.srl"; \
	printf "$(GREEN)✅ Client cert generation complete at: $(NC)%s\n" "$$WEB_MTLS"; \
	printf "$(YELLOW)🔎 Verifying chain...$(NC)\n"; \
	openssl verify -CAfile "$$API_MTLS/ca.pem" "$$WEB_MTLS/client.pem"

caddy-del-certs:
	@set -eu; \
	WEB_MTLS="$(CADDY_MTLS_DIR)"; \
	if [ -d "$$WEB_MTLS" ]; then \
	  rm -rf "$$WEB_MTLS/client.key" "$$WEB_MTLS/client.pem" "$$WEB_MTLS/client.csr" "$$WEB_MTLS/client.srl"; \
	  printf "$(GREEN)✅ files removed from [$(NC)%s$(GREEN)]$(NC)\n" "$$WEB_MTLS"; \
	else \
	  printf "$(YELLOW)⚠️  %s does not exist$(NC)\n" "$$WEB_MTLS"; \
	fi

caddy-validate:
	docker run --rm \
      -v "$(ROOT_PATH)/caddy/WebCaddyfile.internal:/etc/caddy/Caddyfile:ro" \
      -v "$(ROOT_PATH)/caddy/mtls:/etc/caddy/mtls:ro" \
      caddy:2.10.0 caddy validate --config /etc/caddy/Caddyfile
