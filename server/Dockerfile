FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

# Create working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose Express port
EXPOSE 5000

# Start Express server
CMD ["npm", "start"]