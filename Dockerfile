# Build stage
FROM node:22.8.0 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:22.8.0-alpine

# Set working directory
WORKDIR /app

# Copy from build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY next.config.ts ./

# If you have a custom PDF that needs to be included
# COPY --from=builder /app/src/pages/help/costsense_userguide.pdf ./public/


# Expose the port Next.js runs on
ENV PORT 3003
EXPOSE 3003


# Start the app
CMD ["npm", "start"]