# Stage 1: Install dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./
COPY .env* ./

# Install dependencies including the required platform-specific packages
RUN npm ci --include=optional

# Stage 2: Build the application
FROM node:20-slim AS builder
WORKDIR /app

# Copy the dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.env* ./

# Copy the rest of the application code
COPY . .

# Explicitly install the correct lightningcss binary
RUN npm install lightningcss@1.21.5

# Set environment variables for Next.js build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production


# Build the Next.js application
RUN npm run build 

# Stage 3: Serve the application
FROM node:20-slim AS runner
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY next.config.ts ./

# If using next.config.ts, compile it to JS
# RUN if [ -f next.config.ts ]; then \
#      npx tsc next.config.ts --esModuleInterop --module commonjs; \
#    fi

# For standalone output (recommended)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm ci --omit=dev --omit=optional --production --include=optional

# Expose the port the app runs on
ENV PORT 3001
EXPOSE 3001

# Start the Next.js application
CMD ["npm", "start"]