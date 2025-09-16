# docker/Dockerfile

# --- Stage 1: Builder ---
# This stage is nearly identical to your original. It builds the SSR application.
FROM node:22-alpine AS builder

# Define build-time arguments passed from docker-compose.yml
ARG VITE_API_ENV
ARG VITE_API_URL
ARG VITE_HOST_URL
ARG VITE_ACCOUNT_NAME
ARG VITE_PUBLIC_KEY
ARG ENV_API_LOCAL_DIR

WORKDIR /app

COPY package*.json ./
# Use 'npm ci' for reliable, fast, and clean installs
RUN npm ci

COPY . .
# This now builds both the client and server bundles for SSR
RUN npm run build


# --- Stage 2: Production ---
# This is the new final stage. It creates a lightweight Node.js server image.
FROM node:22-alpine AS production

WORKDIR /app

# Copy only the necessary files from the 'builder' stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./

# Install ONLY the production dependencies to keep the image small
RUN npm install --omit=dev

# Expose the port that the Node.js server will listen on
EXPOSE 5173

# The command to start the Node.js rendering server
CMD [ "node", "server.js" ]
