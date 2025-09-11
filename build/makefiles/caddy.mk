.PHONY: caddy-gen-certs caddy-del-certs caddy-validate

CADDY_MTLS_DIR = $(ROOT_PATH)/caddy/mtls

caddy-gen-certs:
	@set -Eeuo pipefail; \
	WEB_MTLS="$(CADDY_MTLS_DIR)"; \
	API_MTLS="$(ENV_API_LOCAL_DIR)"; \
	: "$${API_MTLS:?ENV_API_LOCAL_DIR is empty}"; \
	if [ ! -f "$$API_MTLS/ca.pem" ] || [ ! -f "$$API_MTLS/ca.key" ]; then \
	  printf "$(RED)✘ ERROR:$(NC) Missing CA files in %s (need ca.pem and ca.key)\n" "$$API_MTLS"; exit 1; \
	fi; \
	mkdir -p "$$WEB_MTLS"; chmod 700 "$$WEB_MTLS"; \
	printf "$(BLUE)🔐 Generating client key & CSR...$(NC)\n"; \
	openssl genrsa -out "$$WEB_MTLS/client.key" 4096; \
	openssl req -new -key "$$WEB_MTLS/client.key" -subj "/CN=web-caddy" -out "$$WEB_MTLS/client.csr"; \
	EXTFILE="$$(mktemp)"; \
	trap "rm -f \"$$EXTFILE\"" EXIT; \
	printf "extendedKeyUsage=clientAuth\n" > "$$EXTFILE"; \
	printf "$(YELLOW)✅ Signing client cert with CA...$(NC)\n"; \
	if [ -f "$$API_MTLS/ca.srl" ]; then \
	  openssl x509 -req -in "$$WEB_MTLS/client.csr" \
		-CA "$$API_MTLS/ca.pem" -CAkey "$$API_MTLS/ca.key" -CAserial "$$API_MTLS/ca.srl" \
		-out "$$WEB_MTLS/client.pem" -days 1095 -sha256 -extfile "$$EXTFILE"; \
	else \
	  openssl x509 -req -in "$$WEB_MTLS/client.csr" \
		-CA "$$API_MTLS/ca.pem" -CAkey "$$API_MTLS/ca.key" -CAcreateserial \
		-out "$$WEB_MTLS/client.pem" -days 1095 -sha256 -extfile "$$EXTFILE"; \
	fi; \
	chmod 600 "$$WEB_MTLS/client.key"; chmod 644 "$$WEB_MTLS/client.pem"; \
	rm -f "$$WEB_MTLS/client.csr"; \
	printf "$(GREEN)✅ Client cert written to %s$(NC)\n" "$$WEB_MTLS"; \
	printf "$(WHITE)🔍 Verifying chain...$(NC)\n"; \
	openssl verify -CAfile "$$API_MTLS/ca.pem" "$$WEB_MTLS/client.pem"

caddy-del-certs:
	@set -eu; \
	rm -f "$(CADDY_MTLS_DIR)/ca.key" "$(CADDY_MTLS_DIR)/ca.pem"; \
	printf "$(BLUE)✅ files removed from [$(NC)$(CADDY_MTLS_DIR)$(BLUE)]$(NC)\n"

caddy-validate:
	docker run --rm \
      -v "$(ROOT_PATH)/caddy/WebCaddyfile.internal:/etc/caddy/Caddyfile:ro" \
      -v "$(ROOT_PATH)/caddy/mtls:/etc/caddy/mtls:ro" \
      caddy:2.10.0 caddy validate --config /etc/caddy/Caddyfile
