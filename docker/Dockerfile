# --- Builder Stage ---
# Use a standard Node.js image as the base for building the application.
# This stage compiles your source code into static assets.
FROM node:22-alpine AS builder

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

# Set the working directory inside the container
WORKDIR /app

# Install git to capture commit SHA for release tracking
RUN apk add --no-cache git

# Copy package.json and lock files first to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
# Use 'npm ci' for cleaner, more reliable builds in CI/CD environments
RUN npm ci

# Copy the rest of your application source code
COPY . .

# Run the build script with automatic git SHA release tracking
# If VITE_SENTRY_RELEASE is not provided, use git SHA
# This ensures every build has a unique release identifier
RUN if [ -z "$VITE_SENTRY_RELEASE" ]; then \
        GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown"); \
        VITE_SENTRY_RELEASE="web@$GIT_SHA" npm run build; \
    else \
        npm run build; \
    fi


# --- Artifact Stage ---
# This is the final, lightweight production image using Caddy.
FROM caddy:2.10.0-alpine

# Copy only the built static assets from the 'builder' stage's output directory
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddy configuration file
COPY caddy/WebCaddyfile.internal /etc/caddy/Caddyfile
