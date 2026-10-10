# ─── Build stage ────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install exactly the versions from the lock file
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build

# ─── Serve stage ────────────────────────────────────────
FROM nginx:1.27-alpine

# Replace the default nginx config with ours
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]