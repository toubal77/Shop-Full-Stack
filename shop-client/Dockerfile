# Use Node LTS version
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 100000 \
    && npm config set fetch-timeout 600000 \
    && npm config set registry https://registry.npmmirror.com

# Install dependencies with increased network timeout
RUN npm install --network-timeout=600000

# Install cross-env globally
RUN npm install -g cross-env

# Copy the rest of the application
COPY . .

# Expose port 4200
EXPOSE 4200

# Start the app
CMD ["npm", "start"]