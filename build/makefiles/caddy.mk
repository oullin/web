.PHONY: caddy-gen-certs caddy-del-certs caddy-validate

CADDY_MTLS_DIR = $(ROOT_PATH)/caddy/mtls

caddy-gen-certs:
	@set -eu; \
	WEB_MTLS="$(CADDY_MTLS_DIR)"; \
	API_MTLS="$(ENV_API_LOCAL_DIR)"; \
	if [ -z "$$API_MTLS" ]; then printf "$(RED)✘ ERROR:$(NC) ENV_API_LOCAL_DIR is empty.\n"; exit 1; fi; \
	if [ ! -f "$$API_MTLS/ca.pem" ] || [ ! -f "$$API_MTLS/ca.key" ] || [ ! -f "$$API_MTLS/ca.srl" ]; then \
	  printf "$(RED)✘ ERROR:$(NC) CA files not found in %s. Need ca.pem, ca.key, ca.srl\n" "$$API_MTLS"; exit 1; \
	fi; \
	mkdir -p "$$WEB_MTLS"; chmod 700 "$$WEB_MTLS"; \
	printf "$(BLUE)🔐 Generating client key & CSR...$(NC)\n"; \
	openssl genrsa -out "$$WEB_MTLS/client.key" 4096 >/dev/null 2>&1; \
	openssl req -new -key "$$WEB_MTLS/client.key" -subj "/CN=web-caddy" -out "$$WEB_MTLS/client.csr" >/dev/null 2>&1; \
	printf "$(YELLOW)✅ Signing client cert with CA...$(NC)\n"; \
	openssl x509 -req \
	  -in "$$WEB_MTLS/client.csr" \
	  -CA "$$API_MTLS/ca.pem" -CAkey "$$API_MTLS/ca.key" -CAserial "$$API_MTLS/ca.srl" \
	  -out "$$WEB_MTLS/client.pem" -days 1095 -sha256 \
	  -extfile <(printf "extendedKeyUsage=clientAuth") >/dev/null 2>&1; \
	chmod 600 "$$WEB_MTLS/client.key"; chmod 644 "$$WEB_MTLS/client.pem"; \
	rm -f "$$WEB_MTLS/client.csr"; \
	printf "$(GREEN)✅ Client cert written to %s$(NC)\n" "$$WEB_MTLS";

caddy-del-certs:
	@set -eu; \
	rm -f "$(CADDY_MTLS_DIR)/ca.key" "$(CADDY_MTLS_DIR)/ca.pem"; \
	printf "$(BLUE)✅ files removed from [$(NC)$(CADDY_MTLS_DIR)$(BLUE)]$(NC)\n"

caddy-validate:
	docker run --rm \
      -v "$(ROOT_PATH)/caddy/WebCaddyfile.internal:/etc/caddy/Caddyfile:ro" \
      -v "$(ROOT_PATH)/caddy/mtls:/etc/caddy/mtls:ro" \
      caddy:2.10.0 caddy validate --config /etc/caddy/Caddyfile
