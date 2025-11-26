FROM node:25-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --include=dev

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port and set the command
EXPOSE 3000
CMD ["npm", "start"]