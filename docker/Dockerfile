# --- Builder Stage ---
# Official Node Docker tags have not caught up to 25.8.2 yet, so install the
# patched runtime directly from nodejs.org in the build image.
FROM debian:bookworm-slim AS builder

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG NODE_VERSION=25.8.2
ARG TARGETARCH

ARG PNPM_VERSION=10.31.0
ARG VITE_API_ENV
ARG VITE_API_URL
ARG VITE_HOST_URL
ARG VITE_ACCOUNT_NAME
ARG VITE_PUBLIC_KEY
ARG VITE_SENTRY_DSN
ARG VITE_SENTRY_RELEASE
ARG VITE_SENTRY_TRACES_SAMPLE_RATE
ARG VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
ARG VITE_SENTRY_REPLAYS_ERROR_SAMPLE_RATE
ARG ENV_API_LOCAL_DIR

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl gpgv libatomic1 xz-utils \
    && rm -rf /var/lib/apt/lists/*

COPY docker/nodejs-keyring.kbx /tmp/nodejs-keyring.kbx

RUN set -eux; \
    case "${TARGETARCH}" in \
        amd64) node_arch='x64' ;; \
        arm64) node_arch='arm64' ;; \
        *) echo "Unsupported TARGETARCH: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl -fsSLO "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${node_arch}.tar.xz"; \
    curl -fsSLO "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt.asc"; \
    gpgv --keyring /tmp/nodejs-keyring.kbx --output SHASUMS256.txt SHASUMS256.txt.asc; \
    grep " node-v${NODE_VERSION}-linux-${node_arch}.tar.xz$" SHASUMS256.txt | sha256sum -c -; \
    tar -xJf "node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" -C /usr/local --strip-components=1 --no-same-owner; \
    rm "node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" SHASUMS256.txt SHASUMS256.txt.asc /tmp/nodejs-keyring.kbx

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install a pinned pnpm via corepack for reproducible Docker builds.
RUN npm install -g corepack@latest --force &&     corepack enable &&     corepack prepare pnpm@${PNPM_VERSION} --activate &&     pnpm install --frozen-lockfile

# Copy the rest of your application source code
COPY . .

# Run the build script
# VITE_SENTRY_RELEASE should be provided as a build argument
RUN pnpm run build


# --- Artifact Stage ---
# This is the final, lightweight production image using Caddy.
FROM caddy:2.10.0-alpine

# Copy only the built static assets from the 'builder' stage's output directory
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddy configuration file
COPY caddy/WebCaddyfile.internal /etc/caddy/Caddyfile
