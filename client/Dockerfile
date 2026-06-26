
# Stage 1 - Build React App

FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first (better Docker caching)
COPY package*.json ./

# Install exact dependencies from package-lock.json
RUN npm ci

# Copy the rest of the application
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundle
RUN npm run build


# Stage 2 - Serve with Nginx

FROM nginx:1.27-alpine

# Copy the production build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (supports React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]