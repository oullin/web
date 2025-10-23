# --- Builder Stage ---
# Use a standard Node.js image as the base for building the application.
# This stage compiles your source code into static assets.
FROM node:24-alpine AS builder

ARG VITE_API_ENV
ARG VITE_API_URL
ARG VITE_HOST_URL
ARG VITE_ACCOUNT_NAME
ARG VITE_PUBLIC_KEY
ARG ENV_API_LOCAL_DIR

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock files first to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
# Use 'npm ci' for cleaner, more reliable builds in CI/CD environments
RUN npm ci

# Copy the rest of your application source code
COPY . .

# Run the build script (e.g., for Vue, React, Angular)
# This creates the static files in a directory like '/app/dist'.
RUN npm run build


# --- Artifact Stage ---
# This is the final, lightweight production image using Caddy.
FROM caddy:2.10.2-alpine

# Copy only the built static assets from the 'builder' stage's output directory
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddy configuration file
COPY caddy/WebCaddyfile.internal /etc/caddy/Caddyfile
